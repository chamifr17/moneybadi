const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type PennyMonRequest = {
  question?: string
  summary?: {
    mood?: string
    moodReason?: string
    today?: {
      spent?: number
      count?: number
      remaining?: number
      topCategories?: Array<{ name: string; amount: number }>
    }
    totals?: {
      available?: number
      debt?: number
      safeSpend?: number
    }
    budgets?: Array<{ name: string; limit: number; spent: number }>
    wallets?: Array<{ name: string; type: string; amount: number; isPiggyBank?: boolean }>
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing GEMINI_API_KEY Supabase secret.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    const { question, summary } = (await req.json()) as PennyMonRequest

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const prompt = `
You are PennyMon, a friendly finance pet inside a personal money tracking app.
Answer only about the user's spending, budget, wallet, debt, and PennyMon mood.
If the question is not related to those topics, politely say you can only help with PennyMon finance.
Use Malaysian Ringgit as RM.
Keep the answer short, clear, friendly, and practical.
Do not shame the user.

Question:
${question}

User finance summary:
${JSON.stringify(summary, null, 2)}
`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 180,
          },
        }),
      },
    )

    const data = await geminiResponse.json()

    if (!geminiResponse.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'Gemini request failed.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: geminiResponse.status,
        },
      )
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not think of an answer right now. Try again in a moment.'

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unexpected error.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
