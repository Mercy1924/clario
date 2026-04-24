import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// CORS configuration
// Production domains + local development
const getCorsHeaders = (origin?: string | null) => {
  const allowedOrigins = [
    'clarios://',                  // Mobile app scheme (always allowed)
    'http://localhost:19006',      // Expo local development
    'http://localhost:8081',       // Expo local development (alternative)
    'https://clarios.app',         // Production web app
    'https://www.clarios.app',     // Production web app (www)
  ];

  const isValidOrigin = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isValidOrigin ? origin : 'clarios://',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req.headers.get('origin')) });
  }

  try {
    const { image_urls, variation_request, previous_diagram } = await req.json();

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one image URL is required' }),
        {
          status: 400,
          headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        }
      );
    }

    // Build the prompt for diagram generation
    const systemPrompt = `You are Clarios, a spatial design AI. You generate simple top-down SVG diagrams showing furniture layout.
Create clear, labelled block diagrams - not artistic renderings. Focus on furniture positions, walls, doors, and windows.`;

    const userPrompt = `Generate a top-down layout diagram as SVG.

Analyse the room photo and create:
1. A "before" SVG showing current furniture positions
2. An "after" SVG showing an optimised arrangement

Design principles:
- Improve traffic flow (clear paths between furniture)
- Maximise natural light access
- Create clear zones for different activities
- Reduce visual clutter

${variation_request ? `Variation request: ${variation_request}` : ''}

Respond in this exact JSON format (no markdown, no code blocks):
{
  "before_svg": "<svg>...</svg>",
  "after_svg": "<svg>...</svg>",
  "annotations": [
    {
      "id": "1",
      "label": "Desk",
      "position": { "x": 50, "y": 30 },
      "change": "Moved to north wall"
    }
  ]
}

SVG requirements:
- Use simple rectangles for furniture
- Label each piece clearly
- Use consistent scale
- ViewBox should be "0 0 100 100" for easy rendering
- Use contrasting colors for walls vs furniture`;

    // Prepare images for Gemini Vision
    const parts: any[] = [
      { text: systemPrompt },
      { text: userPrompt },
    ];

    // Add each image as a base64 data URL
    for (const url of image_urls) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: url.split(',')[1] || url, // Remove data:image/jpeg;base64, prefix if present
        },
      });
    }

    // Call Gemini API
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content from Gemini');
    }

    // Parse the JSON response
    let result;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate required fields
    if (!result.before_svg || !result.after_svg) {
      throw new Error('Missing SVG diagrams in AI response');
    }
    if (!result.annotations || !Array.isArray(result.annotations)) {
      result.annotations = [];
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Diagram generation failed' }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      }
    );
  }
});
