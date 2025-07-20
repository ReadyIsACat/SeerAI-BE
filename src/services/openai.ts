import OpenAI from 'openai';
import { TarotReadingRequest, TarotReadingResponse } from '../types/tarot';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const projectId = process.env.PROJECT_ID;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    if (!projectId) {
      throw new Error('PROJECT_ID environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey,
      project: projectId,
    });
  }

  async generateTarotReading(request: TarotReadingRequest): Promise<TarotReadingResponse> {
    const { question, selectedCards } = request;

    const cardsDescription = selectedCards
      .map((card, index) => {
        const position = index === 0 ? 'past' : index === 1 ? 'present' : 'future';
        return `${position}: ${card.name}${card.suit ? ` (${card.suit})` : ''} - ${card.description}`;
      })
      .join('\n');

    const prompt = `You are a professional tarot reader with deep knowledge of tarot symbolism and interpretation. 

Question: "${question}"

Selected cards and their positions:
${cardsDescription}

Please provide a comprehensive tarot reading that includes:

1. A general reading that connects all three cards and addresses the question
2. A detailed interpretation of how the cards relate to each other
3. Practical advice based on the reading
4. Individual meanings for each card in their specific positions (past, present, future)

Format your response as a JSON object with the following structure:
{
  "reading": "General reading text",
  "interpretation": "Detailed interpretation text", 
  "advice": "Practical advice text",
  "cards": [
    {
      "name": "Card name",
      "position": "past|present|future",
      "meaning": "Specific meaning for this position"
    }
  ]
}

Make the reading insightful, compassionate, and practical while maintaining the mystical nature of tarot.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional tarot reader. Always respond with valid JSON format as requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response content received from OpenAI');
      }

      // Try to parse the JSON response
      try {
        const parsedResponse = JSON.parse(responseContent);
        return parsedResponse as TarotReadingResponse;
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        return this.createStructuredResponse(responseContent, selectedCards);
      }
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      throw new Error('Failed to generate tarot reading');
    }
  }

  private createStructuredResponse(text: string, selectedCards: any[]): TarotReadingResponse {
    // Fallback method if JSON parsing fails
    const sections = text.split('\n\n');
    
    return {
      reading: sections[0] || "A mystical reading reveals insights about your question.",
      interpretation: sections[1] || "The cards speak of transformation and growth.",
      advice: sections[2] || "Trust your intuition and embrace the journey ahead.",
      cards: selectedCards.map((card, index) => {
        const positions: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];
        return {
          name: card.name,
          position: positions[index] || 'present',
          meaning: card.description || "This card holds significance for your journey."
        };
      })
    };
  }
} 