export interface TarotCard {
  id: number;
  name: string;
  suit?: string;
  arcana: 'major' | 'minor';
  description: string;
}

export interface TarotReadingRequest {
  question: string;
  selectedCards: TarotCard[];
}

export interface TarotCardReading {
  name: string;
  position: 'past' | 'present' | 'future';
  meaning: string;
}

export interface TarotReadingResponse {
  reading: string;
  interpretation: string;
  advice: string;
  cards: TarotCardReading[];
} 