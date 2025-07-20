import { Request, Response } from 'express';
import { OpenAIService } from '../services/openai';
import { TarotReadingRequest, TarotReadingResponse } from '../types/tarot';

export class TarotController {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  async generateReading(req: Request, res: Response): Promise<void> {
    try {
      const requestData: TarotReadingRequest = req.body;

      // Validate request
      if (!requestData.question || !requestData.selectedCards) {
        res.status(400).json({
          error: 'Missing required fields: question and selectedCards are required'
        });
        return;
      }

      if (requestData.selectedCards.length !== 3) {
        res.status(400).json({
          error: 'Exactly 3 cards must be selected for a tarot reading'
        });
        return;
      }

      // Generate tarot reading
      const reading: TarotReadingResponse = await this.openaiService.generateTarotReading(requestData);

      res.status(200).json(reading);
    } catch (error) {
      console.error('Error in tarot controller:', error);
      res.status(500).json({
        error: 'Internal server error while generating tarot reading'
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      message: 'SeerAI Tarot Backend is running',
      timestamp: new Date().toISOString()
    });
  }
} 