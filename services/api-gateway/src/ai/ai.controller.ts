import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('generate-description')
  @ApiOperation({ summary: 'Generate event description using AI' })
  async generateDescription(
    @Body('title') title: string,
    @Body('category') category: string,
  ) {
    const description = await this.aiService.generateEventDescription(title, category);
    return { description };
  }

  @Post('generate-image')
  @ApiOperation({ summary: 'Generate event image using AI' })
  async generateImage(
    @Body('title') title: string,
    @Body('category') category: string,
  ) {
    const imageUrl = await this.aiService.generateEventImage(title, category);
    return { imageUrl };
  }

  @Get('recommendations/:userId')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  async getRecommendations(@Param('userId') userId: string) {
    const recommendations = await this.aiService.getPersonalizedRecommendations(userId);
    return { recommendations };
  }

  @Post('dynamic-pricing')
  @ApiOperation({ summary: 'Calculate dynamic pricing' })
  async calculatePricing(
    @Body('eventId') eventId: string,
    @Body('demand') demand: number,
  ) {
    const price = await this.aiService.calculateDynamicPricing(eventId, demand);
    return { price };
  }

  @Post('detect-fraud')
  @ApiOperation({ summary: 'Detect ticket fraud' })
  async detectFraud(@Body() ticketData: any) {
    const result = await this.aiService.detectFraud(ticketData);
    return result;
  }

  @Post('generate-marketing')
  @ApiOperation({ summary: 'Generate marketing copy' })
  async generateMarketing(@Body() eventData: any) {
    const copy = await this.aiService.generateMarketingCopy(eventData);
    return copy;
  }

  @Post('chatbot')
  @ApiOperation({ summary: 'Chatbot response' })
  async chatbot(
    @Body('message') message: string,
    @Body('context') context: any,
  ) {
    const response = await this.aiService.chatbotResponse(message, context);
    return { response };
  }
}
