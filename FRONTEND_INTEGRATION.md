# Frontend Integration Guide

Your SeerAI backend is now running on `http://localhost:3001`. Here's how to integrate it with your frontend.

## **Backend Endpoints**

- **Health Check**: `GET http://localhost:3001/api/tarot/health`
- **Tarot Reading**: `POST http://localhost:3001/api/tarot/reading`

## **Frontend Integration Examples**

### **1. React/Next.js Integration**

```typescript
// types/tarot.ts
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

// services/tarotService.ts
const API_BASE_URL = 'http://localhost:3001/api/tarot';

export class TarotService {
  static async generateReading(request: TarotReadingRequest): Promise<TarotReadingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reading`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}

// React Component Example
import React, { useState } from 'react';
import { TarotService, TarotReadingRequest, TarotReadingResponse } from './services/tarotService';

const TarotReadingComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [reading, setReading] = useState<TarotReadingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCards.length !== 3) {
      setError('Please select exactly 3 cards');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: TarotReadingRequest = {
        question,
        selectedCards
      };

      const response = await TarotService.generateReading(request);
      setReading(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tarot-reading">
      <h2>🔮 Tarot Reading</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="question">Your Question:</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know?"
            required
          />
        </div>

        {/* Card selection UI would go here */}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Generating Reading...' : 'Get Reading'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {reading && (
        <div className="reading-result">
          <h3>Your Reading</h3>
          <div className="general-reading">
            <h4>General Reading</h4>
            <p>{reading.reading}</p>
          </div>
          
          <div className="interpretation">
            <h4>Interpretation</h4>
            <p>{reading.interpretation}</p>
          </div>
          
          <div className="advice">
            <h4>Advice</h4>
            <p>{reading.advice}</p>
          </div>
          
          <div className="cards">
            <h4>Card Meanings</h4>
            {reading.cards.map((card, index) => (
              <div key={index} className="card">
                <h5>{card.name} ({card.position})</h5>
                <p>{card.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotReadingComponent;
```

### **2. Vanilla JavaScript Integration**

```javascript
// tarot-api.js
class TarotAPI {
  constructor(baseURL = 'http://localhost:3001/api/tarot') {
    this.baseURL = baseURL;
  }

  async generateReading(request) {
    try {
      const response = await fetch(`${this.baseURL}/reading`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}

// Usage example
const tarotAPI = new TarotAPI();

// Example request
const request = {
  question: "What does my future hold?",
  selectedCards: [
    {
      id: 1,
      name: "The Fool",
      suit: "Major Arcana",
      arcana: "major",
      description: "New beginnings, innocence, spontaneity"
    },
    {
      id: 2,
      name: "The Lovers",
      suit: "Major Arcana",
      arcana: "major",
      description: "Love, harmony, relationships"
    },
    {
      id: 3,
      name: "The World",
      suit: "Major Arcana",
      arcana: "major",
      description: "Completion, fulfillment, wholeness"
    }
  ]
};

// Generate reading
tarotAPI.generateReading(request)
  .then(reading => {
    console.log('Reading:', reading);
    displayReading(reading);
  })
  .catch(error => {
    console.error('Error:', error);
  });

function displayReading(reading) {
  const container = document.getElementById('reading-container');
  container.innerHTML = `
    <h3>Your Reading</h3>
    <div class="reading">
      <h4>General Reading</h4>
      <p>${reading.reading}</p>
      
      <h4>Interpretation</h4>
      <p>${reading.interpretation}</p>
      
      <h4>Advice</h4>
      <p>${reading.advice}</p>
      
      <h4>Card Meanings</h4>
      ${reading.cards.map(card => `
        <div class="card">
          <h5>${card.name} (${card.position})</h5>
          <p>${card.meaning}</p>
        </div>
      `).join('')}
    </div>
  `;
}
```

### **3. Vue.js Integration**

```javascript
// services/tarotService.js
export const tarotService = {
  async generateReading(request) {
    try {
      const response = await fetch('http://localhost:3001/api/tarot/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      throw error;
    }
  }
};

// Vue Component
<template>
  <div class="tarot-reading">
    <h2>🔮 Tarot Reading</h2>
    
    <form @submit.prevent="generateReading">
      <div>
        <label for="question">Your Question:</label>
        <input
          id="question"
          v-model="question"
          type="text"
          placeholder="What would you like to know?"
          required
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Generating Reading...' : 'Get Reading' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="reading" class="reading-result">
      <h3>Your Reading</h3>
      <div class="general-reading">
        <h4>General Reading</h4>
        <p>{{ reading.reading }}</p>
      </div>
      
      <div class="interpretation">
        <h4>Interpretation</h4>
        <p>{{ reading.interpretation }}</p>
      </div>
      
      <div class="advice">
        <h4>Advice</h4>
        <p>{{ reading.advice }}</p>
      </div>
      
      <div class="cards">
        <h4>Card Meanings</h4>
        <div v-for="(card, index) in reading.cards" :key="index" class="card">
          <h5>{{ card.name }} ({{ card.position }})</h5>
          <p>{{ card.meaning }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tarotService } from '@/services/tarotService';

export default {
  name: 'TarotReading',
  data() {
    return {
      question: '',
      selectedCards: [],
      reading: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async generateReading() {
      if (this.selectedCards.length !== 3) {
        this.error = 'Please select exactly 3 cards';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const request = {
          question: this.question,
          selectedCards: this.selectedCards
        };

        const response = await tarotService.generateReading(request);
        this.reading = response;
      } catch (err) {
        this.error = err.message || 'Failed to generate reading';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## **CORS Configuration**

Your backend is already configured to accept requests from:
- `http://localhost:3000` (your frontend)
- `http://localhost:3001` (backend)

If you need to add more origins, update the `ALLOWED_ORIGINS` in your `.env` file:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

## **Testing the Integration**

1. **Test the health endpoint:**
   ```bash
   curl http://localhost:3001/api/tarot/health
   ```

2. **Test the reading endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/tarot/reading \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What does my future hold?",
       "selectedCards": [
         {
           "id": 1,
           "name": "The Fool",
           "suit": "Major Arcana",
           "arcana": "major",
           "description": "New beginnings, innocence, spontaneity"
         },
         {
           "id": 2,
           "name": "The Lovers",
           "suit": "Major Arcana",
           "arcana": "major",
           "description": "Love, harmony, relationships"
         },
         {
           "id": 3,
           "name": "The World",
           "suit": "Major Arcana",
           "arcana": "major",
           "description": "Completion, fulfillment, wholeness"
         }
       ]
     }'
   ```

## **Error Handling**

The backend returns proper HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing fields, wrong number of cards)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

Always handle these errors in your frontend code. 