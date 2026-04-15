import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { image_urls, context } = await req.json();

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one image URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

    // Build the prompt for GPT-4o Vision
    let systemPrompt = `You are Clarios, a calm, directive AI assistant for space improvement.
You analyse room photos and provide actionable guidance for people with ADHD.
Be specific, practical, and non-judgmental. Focus on what can be done, not what's wrong.`;

    let userPrompt = `Analyse this space and provide:
1. Annotated observations (what you see)
2. Findings with severity levels (low/medium/high)
3. A mode recommendation (tidy or restructure) with rationale
4. Sequential steps for the recommended mode

${context?.space_type ? `Space type: ${context.space_type}` : ''}
${context?.goal ? `User's goal: ${context.goal}` : ''}
${context?.mode_preference ? `User's mode preference: ${context.mode_preference}` : ''}

Respond in this exact JSON format:
{
  "findings": [
    {
      "id": "1",
      "label": "Brief label",
      "description": "1-2 sentence description",
      "severity": "low|medium|high",
      "category": "clutter|cleaning|layout|light|flow"
    }
  ],
  "mode_recommendation": "tidy|restructure",
  "mode_rationale": "Why this mode is recommended for this space",
  "context_confirmed": true|false,
  "steps": [
    {
      "title": "Action-oriented step title",
      "substeps": [{"id": "1", "title": "Substep description"}],
      "time_estimate": 5
    }
  ]
}`;

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
        max_tokens: 2000,
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
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate required fields
    if (!result.findings || !Array.isArray(result.findings)) {
      throw new Error('Missing findings in AI response');
    }
    if (!result.mode_recommendation || !['tidy', 'restructure'].includes(result.mode_recommendation)) {
      throw new Error('Invalid mode_recommendation in AI response');
    }
    if (!result.steps || !Array.isArray(result.steps)) {
      throw new Error('Missing steps in AI response');
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Analysis failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
