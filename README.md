# SeerAI Backend

A Node.js backend service for AI-powered tarot readings using OpenAI's GPT-4 API.

## Features

- 🔮 AI-powered tarot readings with GPT-4
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 TypeScript support
- 🚀 Express.js REST API
- 🔍 Input validation
- ⚡ Error handling and logging

## API Endpoints

### Health Check
```
GET /api/tarot/health
```
Returns server status and health information.

### Generate Tarot Reading
```
POST /api/tarot/reading
```

**Request Body:**
```typescript
{
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
}
```

**Response:**
```typescript
{
  "reading": "General reading text connecting all cards...",
  "interpretation": "Detailed interpretation of card relationships...",
  "advice": "Practical advice based on the reading...",
  "cards": [
    {
      "name": "The Fool",
      "position": "past",
      "meaning": "Specific meaning for past position..."
    },
    {
      "name": "The Lovers", 
      "position": "present",
      "meaning": "Specific meaning for present position..."
    },
    {
      "name": "The World",
      "position": "future", 
      "meaning": "Specific meaning for future position..."
    }
  ]
}
```

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SeerAI-BE
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration  
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Development

Start development server with hot reload:
```bash
npm run dev
```

### Production

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── index.ts         # Main application entry point
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | http://localhost:3000 |

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error responses

## Testing

Run tests:
```bash
npm test
```

## License

MIT