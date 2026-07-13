import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { creatorNiche, subscriberCount, companyDescription } = await req.json();

    const systemPrompt = `You are an expert SaaS data analysis engine mapping brand alignments for YouTube metrics.
    Assess alignment across compatibility indexing, score criteria, parameters, matching targets, and provide raw JSON output.`;

    const userPrompt = `Calculate sponsor metrics match breakdown:
    Creator Niche: ${creatorNiche}
    Reach Metrics: ${subscriberCount} subscribers
    Company Parameters: ${companyDescription}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
