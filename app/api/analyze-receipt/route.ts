import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this receipt and return a JSON object with the following structure: { items: [{ name: string, price: number, quantity: number }], total: number, tax: number, date: string, merchant: string }. Extract all items with their individual prices and quantities. Round all prices to 2 decimal places. If quantity is not specified, assume 1."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });
      

    // Parse the response to ensure it's valid JSON
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    // Extract JSON from the response (in case GPT adds any additional text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in OpenAI response');
    }

    try {
      const receiptData = JSON.parse(jsonMatch[0]);
      return NextResponse.json(receiptData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse receipt data from OpenAI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to analyze receipt: ${errorMessage}` },
      { status: 500 }
    );
  }
} 