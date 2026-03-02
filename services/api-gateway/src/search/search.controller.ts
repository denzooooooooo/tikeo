import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Recherche globale d\'événements, organisateurs et plus' })
  @ApiQuery({ name: 'q', required: true, description: 'Terme de recherche' })
  @ApiQuery({ name: 'type', required: false, description: 'Type: events, organizers, all' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre de résultats' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.search(query, type || 'all', limit ? parseInt(limit) : 10);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Suggestions de recherche auto-complete' })
  @ApiQuery({ name: 'q', required: true, description: 'Terme de recherche' })
  async getSuggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query);
  }
}

