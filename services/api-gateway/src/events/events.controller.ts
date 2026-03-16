import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request, HttpException, HttpStatus, NotFoundException,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ─── GET /events ─────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les événements avec filtres' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'userCountry', required: false, type: String, description: 'Pays de l\'utilisateur pour tri géoloc' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['date', 'popular', 'price_asc', 'price_desc'] })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'isFree', required: false, type: Boolean })
  @ApiQuery({ name: 'isOnline', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Événements récupérés avec succès' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('country') country?: string,
    @Query('userCountry') userCountry?: string,
    @Query('sortBy') sortBy?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('isFree') isFree?: string,
    @Query('isOnline') isOnline?: string,
  ) {
    return this.eventsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      { category, search, city, country, userCountry, sortBy, minPrice, maxPrice, dateFrom, dateTo, isFree, isOnline },
    );
  }

  // ─── GET /events/featured ────────────────────────────────────────────────────
  @Get('featured')
  @ApiOperation({ summary: 'Événements en vedette' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'country', required: false, type: String })
  async getFeatured(
    @Query('limit') limit?: string,
    @Query('country') country?: string,
  ) {
    return this.eventsService.getFeatured(limit ? parseInt(limit) : 6);
  }

  // ─── GET /events/nearby ──────────────────────────────────────────────────────
  @Get('nearby')
  @ApiOperation({ summary: 'Événements proches (par pays/ville)' })
  @ApiQuery({ name: 'country', required: true, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNearby(
    @Query('country') country: string,
    @Query('city') city?: string,
    @Query('limit') limit?: string,
  ) {
    if (!country) {
      throw new HttpException('Le paramètre country est requis', HttpStatus.BAD_REQUEST);
    }
    return this.eventsService.getNearby(country, city, limit ? parseInt(limit) : 12);
  }

  // ─── GET /events/countries ───────────────────────────────────────────────────
  @Get('countries')
  @ApiOperation({ summary: 'Liste des pays avec des événements' })
  async getCountries() {
    return this.eventsService.getCountries();
  }

  // ─── GET /events/countries/counts ─────────────────────────────────────────────
  @Get('countries/counts')
  @ApiOperation({ summary: 'Nombre d\'événements par pays (10 pays africains)' })
  async getCountryCounts() {
    return this.eventsService.getCountryCounts();
  }

  // ─── GET /events/cities ──────────────────────────────────────────────────────
  @Get('cities')
  @ApiOperation({ summary: 'Liste des villes avec des événements' })
  @ApiQuery({ name: 'country', required: false, type: String })
  async getCities(@Query('country') country?: string) {
    return this.eventsService.getCities(country);
  }

  // ─── GET /events/recommendations ────────────────────────────────────────────
  @Get('recommendations')
  @ApiOperation({ summary: 'Événements recommandés' })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecommendations(
    @Query('country') country?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getRecommendations(undefined, country, limit ? parseInt(limit) : 10);
  }

  // ─── GET /events/my ──────────────────────────────────────────────────────────
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes événements (organisateur connecté)' })
  async getMyEvents(@Request() req: any) {
    return this.eventsService.findMyEvents(req.user?.id);
  }

  // ─── GET /events/:id ─────────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par ID ou slug' })
  @ApiResponse({ status: 200, description: 'Événement trouvé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  async findOne(@Param('id') id: string) {
    // Try by ID first, then by slug
    let event = await this.eventsService.findOne(id);
    if (!event) {
      event = await this.eventsService.findBySlug(id);
    }
    if (!event) {
      throw new NotFoundException(`Événement "${id}" non trouvé`);
    }
    return event;
  }

  // ─── POST /events ─────────────────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel événement' })
  @ApiResponse({ status: 201, description: 'Événement créé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async create(@Body() createEventDto: any, @Request() req: any) {
    try {
      return await this.eventsService.create(createEventDto, req.user?.id);
    } catch (error: any) {
      // Return detailed error message for debugging
      throw new HttpException(
        { message: error?.message || 'Erreur inconnue', detail: error?.meta || null },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─── PUT /events/:id ──────────────────────────────────────────────────────────
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: any,
    @Request() req: any,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user?.id);
  }

  // ─── DELETE /events/:id ───────────────────────────────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un événement' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.remove(id, req.user?.id);
  }

  // ─── POST /events/:id/publish ─────────────────────────────────────────────────
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publier un événement' })
  async publish(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.publish(id, req.user?.id);
  }

  // ─── POST /events/:id/unpublish ───────────────────────────────────────────────
  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dépublier un événement (repasse en brouillon)' })
  async unpublish(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.unpublish(id, req.user?.id);
  }

  // ─── POST /events/:id/upload-cover ──────────────────────────────────────────
  @Post(':id/upload-cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
@ApiConsumes('multipart/form-data')


  @ApiOperation({ summary: 'Upload image de couverture événement (galerie)' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverImage(
    @Param('id') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new HttpException('Fichier requis', HttpStatus.BAD_REQUEST);
    
    // Validate image
    if (!file.mimetype.startsWith('image/')) {
      throw new HttpException('Seule les images sont autorisées (jpg, png, webp)', HttpStatus.BAD_REQUEST);
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new HttpException('Taille max 5MB', HttpStatus.BAD_REQUEST);
    }

    return this.eventsService.uploadCoverImage(eventId, file, req.user.id);
  }

  // ─── POST /events/:id/ticket-types ────────────────────────────────────────────
  @Post(':id/ticket-types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un type de billet pour un événement' })
  async createTicketType(
    @Param('id') id: string,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return this.eventsService.createTicketType(id, dto, req.user?.id);
  }


  // ─── PUT /events/:id/ticket-types/:ttId ───────────────────────────────────────
  @Put(':id/ticket-types/:ttId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un type de billet' })
  async updateTicketType(
    @Param('id') id: string,
    @Param('ttId') ttId: string,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return this.eventsService.updateTicketType(id, ttId, dto, req.user?.id);
  }

  // ─── DELETE /events/:id/ticket-types/:ttId ────────────────────────────────────
  @Delete(':id/ticket-types/:ttId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un type de billet' })
  async deleteTicketType(
    @Param('id') id: string,
    @Param('ttId') ttId: string,
    @Request() req: any,
  ) {
    return this.eventsService.deleteTicketType(id, ttId, req.user?.id);
  }

  // ─── DELETE /events/admin/cleanup ─────────────────────────────────────────────
  @Delete('admin/cleanup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN — Supprimer tous les événements (nettoyage seed)' })
  async adminCleanup(@Request() req: any) {
    if (req.user?.role !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.eventsService.deleteAllEvents();
  }
}
