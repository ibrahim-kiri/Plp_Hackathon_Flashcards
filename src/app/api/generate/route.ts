import { type NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

type flashcard = {
  front: string;
  back: string;
}[];

const basePrompt: string = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
`;

export async function POST(request: NextRequest) {
  try {
    const { prompt }: { prompt: string } = await request.json();

    const combinedPrompt = `${basePrompt} ${prompt}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(combinedPrompt);
    const response: flashcard = JSON.parse(result.response.text());
    return NextResponse.json({ flashcards: response }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
