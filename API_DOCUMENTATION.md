# SeerAI Tarot API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, no authentication is required. However, rate limiting is applied (100 requests per 15 minutes per IP).

## Endpoints

### 1. Health Check

**GET** `/api/tarot/health`

Returns the health status of the server.

**Response:**
```json
{
  "status": "healthy",
  "message": "SeerAI Tarot Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Generate Tarot Reading

**POST** `/api/tarot/reading`

Generates an AI-powered tarot reading based on the provided question and selected cards.

**Request Body:**
```typescript
{
  "question": string,           // Required: The question for the tarot reading
  "selectedCards": [            // Required: Array of exactly 3 tarot cards
    {
      "id": number,             // Required: Unique identifier for the card
      "name": string,           // Required: Name of the tarot card
      "suit": string,           // Optional: Suit of the card (e.g., "Major Arcana", "Cups")
      "arcana": "major" | "minor", // Required: Type of arcana
      "description": string     // Required: Description or meaning of the card
    }
  ]
}
```

**Example Request:**
```json
{
  "question": "What does my future hold in terms of career and relationships?",
  "selectedCards": [
    {
      "id": 1,
      "name": "The Fool",
      "suit": "Major Arcana",
      "arcana": "major",
      "description": "New beginnings, innocence, spontaneity, free spirit"
    },
    {
      "id": 2,
      "name": "The Lovers",
      "suit": "Major Arcana",
      "arcana": "major",
      "description": "Love, harmony, relationships, choices, alignment of values"
    },
    {
      "id": 3,
      "name": "The World",
      "suit": "Major Arcana",
      "arcana": "major",
      "description": "Completion, fulfillment, wholeness, integration, accomplishment"
    }
  ]
}
```

**Response:**
```typescript
{
  "reading": string,            // General reading connecting all cards
  "interpretation": string,     // Detailed interpretation of card relationships
  "advice": string,             // Practical advice based on the reading
  "cards": [                    // Individual card meanings in their positions
    {
      "name": string,           // Card name
      "position": "past" | "present" | "future", // Position in the spread
      "meaning": string         // Specific meaning for this position
    }
  ]
}
```

**Example Response:**
```json
{
  "reading": "Your journey begins with the innocence of The Fool, representing a fresh start in your career path. The Lovers in the present position suggests you're currently facing important decisions about relationships and values alignment. The World in the future position indicates ultimate fulfillment and completion of your goals.",
  "interpretation": "The Fool to The Lovers to The World creates a powerful narrative of personal growth. You're moving from new beginnings through relationship choices to ultimate fulfillment. This suggests that your career and relationship decisions are interconnected and will lead to a sense of wholeness.",
  "advice": "Embrace the new opportunities that come your way with the openness of The Fool. When making decisions about relationships and career, trust your intuition and align with your core values. Remember that every choice you make is leading you toward your ultimate fulfillment.",
  "cards": [
    {
      "name": "The Fool",
      "position": "past",
      "meaning": "You've recently embarked on a new journey or taken a leap of faith in your career or personal life. This represents the beginning of an important chapter."
    },
    {
      "name": "The Lovers",
      "position": "present",
      "meaning": "You're currently facing important choices that will affect both your career and relationships. Trust your heart and align your decisions with your true values."
    },
    {
      "name": "The World",
      "position": "future",
      "meaning": "Your path leads to a sense of completion and fulfillment. You'll achieve a state of wholeness where all aspects of your life are in harmony."
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: question and selectedCards are required"
}
```

```json
{
  "error": "Exactly 3 cards must be selected for a tarot reading"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error while generating tarot reading"
}
```

## Frontend Integration Example

### JavaScript/TypeScript
```typescript
const generateTarotReading = async (question: string, selectedCards: any[]) => {
  try {
    const response = await fetch('http://localhost:3000/api/tarot/reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        selectedCards
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reading = await response.json();
    return reading;
  } catch (error) {
    console.error('Error generating tarot reading:', error);
    throw error;
  }
};

// Usage
const reading = await generateTarotReading(
  "What does my future hold?",
  selectedCards
);
console.log(reading);
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/tarot/reading \
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

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 status code when limit is exceeded

## CORS

The API supports CORS for frontend integration:
- **Allowed Origins**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Default**: `http://localhost:3000`
- **Credentials**: Supported for authenticated requests 