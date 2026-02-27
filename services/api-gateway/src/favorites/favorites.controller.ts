import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserFavorites(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.favoritesService.getUserFavorites(req.user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Post(':eventId')
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Request() req: any, @Param('eventId') eventId: string) {
    const favorite = await this.favoritesService.addFavorite(req.user.id, eventId);
    return {
      message: 'Event added to favorites',
      isFavorite: true,
      favoriteId: favorite.id,
    };
  }

  @Delete(':eventId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Request() req: any, @Param('eventId') eventId: string) {
    await this.favoritesService.removeFavorite(req.user.id, eventId);
    return {
      message: 'Event removed from favorites',
      isFavorite: false,
    };
  }

  @Get('check/:eventId')
  @UseGuards(JwtAuthGuard)
  async isFavorite(@Request() req: any, @Param('eventId') eventId: string) {
    const isFavorited = await this.favoritesService.isFavorite(req.user.id, eventId);
    return { isFavorite: isFavorited };
  }

  @Post('toggle/:eventId')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(@Request() req: any, @Param('eventId') eventId: string) {
    return this.favoritesService.toggleFavorite(req.user.id, eventId);
  }

  @Get('ids')
  @UseGuards(JwtAuthGuard)
  async getFavoriteIds(@Request() req: any) {
    return this.favoritesService.getFavoriteIds(req.user.id);
  }
}

