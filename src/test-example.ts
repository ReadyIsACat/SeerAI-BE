// Example usage of the tarot reading API
// This file demonstrates how to call the API endpoints

import { TarotReadingRequest } from './types/tarot';

// Example request data
export const exampleRequest: TarotReadingRequest = {
  question: "What does my future hold in terms of career and relationships?",
  selectedCards: [
    {
      id: 1,
      name: "The Fool",
      suit: "Major Arcana",
      arcana: "major",
      description: "New beginnings, innocence, spontaneity, free spirit"
    },
    {
      id: 2,
      name: "The Lovers",
      suit: "Major Arcana",
      arcana: "major", 
      description: "Love, harmony, relationships, choices, alignment of values"
    },
    {
      id: 3,
      name: "The World",
      suit: "Major Arcana",
      arcana: "major",
      description: "Completion, fulfillment, wholeness, integration, accomplishment"
    }
  ]
};

// Example of how to call the API from frontend
export const callTarotAPI = async (request: TarotReadingRequest) => {
  try {
    const response = await fetch('http://localhost:3000/api/tarot/reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling tarot API:', error);
    throw error;
  }
};

// Example usage
// callTarotAPI(exampleRequest).then(console.log).catch(console.error); 