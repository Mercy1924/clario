import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { mode, analysis, diagram } = await req.json();

    // Validate required inputs
    if (!mode || !['tidy', 'restructure'].includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Valid mode (tidy/restructure) is required' }),
        {
          status: 400,
          headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        }
      );
    }

    if (!analysis || !analysis.findings || !analysis.steps) {
      return new Response(
        JSON.stringify({ error: 'Valid analysis with findings and steps is required' }),
        {
          status: 400,
          headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    // Build the prompt for Gemini
    const systemPrompt = `You are Clarios, a calm, directive AI assistant for space improvement.
You generate sequential, actionable steps for people with ADHD.
Each step should be:
- Clear and specific (no ambiguity)
- Action-oriented (starts with a verb)
- Achievable in one sitting
- Non-overwhelming (break complex tasks into smaller substeps)

Tone: Calm, supportive, non-judgmental. Focus on progress, not perfection.`;

    const userPrompt = `Generate detailed steps for ${mode} mode.

Context from analysis:
${analysis.findings?.map((f: any) => `- ${f.label}: ${f.description}`).join('\n') || 'No findings provided'}

${diagram ? `
Diagram annotations (for restructure mode):
${diagram.annotations?.map((a: any) => `- ${a.label}: ${a.change || 'position noted'}`).join('\n') || 'No annotations'}
` : ''}

Base steps to expand:
${analysis.steps?.map((s: any, i: number) => `${i + 1}. ${s.title} (${s.time_estimate || 5} min)`).join('\n') || 'No base steps provided'}

Design principles:
- One step at a time (never show full list to user)
- Each step has 2-4 substeps
- Time estimates are realistic (5-15 min per step)
- For Tidy mode: include voice-friendly step descriptions
- For Restructure mode: reference diagram positions (e.g., "move desk to position A")

Respond in this exact JSON format (no markdown, no code blocks):
{
  "steps": [
    {
      "title": "Clear action-oriented title",
      "substeps": [
        { "id": "1", "title": "Specific substep description" },
        { "id": "2", "title": "Another substep" }
      ],
      "time_estimate": 10
    }
  ]
}`;

    // Prepare parts for Gemini
    const parts: any[] = [
      { text: systemPrompt },
      { text: userPrompt },
    ];

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
          maxOutputTokens: 2048,
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
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate response structure
    if (!result.steps || !Array.isArray(result.steps)) {
      throw new Error('Missing steps in AI response');
    }

    // Validate each step has required fields
    for (const step of result.steps) {
      if (!step.title || typeof step.title !== 'string') {
        throw new Error('Each step must have a title');
      }
      if (!step.substeps || !Array.isArray(step.substeps)) {
        throw new Error('Each step must have substeps array');
      }
      if (typeof step.time_estimate !== 'number') {
        step.time_estimate = 5; // Default to 5 minutes
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Step generation failed' }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      }
    );
  }
});
