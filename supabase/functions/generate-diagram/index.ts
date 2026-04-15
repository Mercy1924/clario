import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image_urls, variation_request, previous_diagram } = await req.json();

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one image URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build the prompt for diagram generation
    let systemPrompt = `You are Clarios, a spatial design AI. You generate simple top-down SVG diagrams showing furniture layout.
Create clear, labelled block diagrams - not artistic renderings. Focus on furniture positions, walls, doors, and windows.`;

    let userPrompt = `Generate a top-down layout diagram as SVG.

Analyse the room photo and create:
1. A "before" SVG showing current furniture positions
2. An "after" SVG showing an optimised arrangement

Design principles:
- Improve traffic flow (clear paths between furniture)
- Maximise natural light access
- Create clear zones for different activities
- Reduce visual clutter

${variation_request ? `Variation request: ${variation_request}` : ''}

Respond in this exact JSON format:
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

    // Prepare images for GPT-4o Vision
    const imageContent = image_urls.map((url: string) => ({
      type: 'image_url',
      image_url: { url },
    }));

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [{ type: 'text', text: userPrompt }, ...imageContent],
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content from OpenAI');
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Diagram generation failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
