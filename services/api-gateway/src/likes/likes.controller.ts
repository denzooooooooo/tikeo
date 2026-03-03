import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LikesService } from './likes.service';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // ─── EVENT LIKES ─────────────────────────────────────────────────────────────

  // GET /likes/events/:eventId - Get like status for an event
  @Get('events/:eventId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Récupérer le statut des likes d'un événement" })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiResponse({ status: 200, description: 'Statut récupéré' })
  async getEventLikeStatus(
    @Param('eventId') eventId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.likesService.getEventLikeStatus(eventId, userId);
  }

  // POST /likes/events/:eventId - Like an event
  @Post('events/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liker un événement' })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiResponse({ status: 200, description: 'Like ajouté' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async likeEvent(@Param('eventId') eventId: string, @Request() req: any) {
    return this.likesService.toggleEventLike(req.user.id, eventId);
  }

  // DELETE /likes/events/:eventId - Unlike an event
  @Delete('events/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retirer le like d un événement' })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiResponse({ status: 200, description: 'Like retiré' })
  async unlikeEvent(@Param('eventId') eventId: string, @Request() req: any) {
    return this.likesService.toggleEventLike(req.user.id, eventId);
  }

  // GET /likes/my - Get user's liked events
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer les événements likés par l'utilisateur" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Événements likés' })
  async getMyLikedEvents(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.likesService.getUserLikedEvents(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  // ─── ORGANIZER FOLLOW/SUBSCRIBE ─────────────────────────────────────────────

  // GET /likes/organizers/:organizerId - Get follow status (optional auth - reads user if logged in)
  @Get('organizers/:organizerId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Récupérer le statut d'abonnement d'un organisateur" })
  @ApiParam({ name: 'organizerId', description: "ID de l'organisateur" })
  @ApiResponse({ status: 200, description: 'Statut récupéré' })
  async getOrganizerFollowStatus(
    @Param('organizerId') organizerId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.likesService.getOrganizerSubscriptionStatus(organizerId, userId);
  }

  // POST /likes/organizers/:organizerId/follow - Follow an organizer
  @Post('organizers/:organizerId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "S'abonner à un organisateur" })
  @ApiParam({ name: 'organizerId', description: "ID de l'organisateur" })
  @ApiResponse({ status: 200, description: 'Abonnement ajouté' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async followOrganizer(
    @Param('organizerId') organizerId: string,
    @Request() req: any,
  ) {
    return this.likesService.toggleOrganizerSubscription(req.user.id, organizerId);
  }

  // DELETE /likes/organizers/:organizerId/follow - Unfollow an organizer
  @Delete('organizers/:organizerId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Se désabonner d'un organisateur" })
  @ApiParam({ name: 'organizerId', description: "ID de l'organisateur" })
  @ApiResponse({ status: 200, description: 'Abonnement retiré' })
  async unfollowOrganizer(
    @Param('organizerId') organizerId: string,
    @Request() req: any,
  ) {
    return this.likesService.toggleOrganizerSubscription(req.user.id, organizerId);
  }

  // GET /likes/my/subscriptions - Get user's subscriptions
  @Get('my/subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer les organisateurs auxqu l'utilisateur est abonné" })
  @ApiResponse({ status: 200, description: 'Abonnements récupérés' })
  async getMySubscriptions(@Request() req: any) {
    return this.likesService.getUserSubscriptions(req.user.id);
  }

  // ─── USER FOLLOWS (SOCIAL) ──────────────────────────────────────────────────

  // POST /likes/users/:userId/follow - Follow a user
  @Post('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suivre un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur à suivre" })
  @ApiResponse({ status: 200, description: 'Follow ajouté' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async followUser(@Param('userId') userId: string, @Request() req: any) {
    return this.likesService.toggleFollow(req.user.id, userId);
  }

  // DELETE /likes/users/:userId/follow - Unfollow a user
  @Delete('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Ne plus suivre un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur à ne plus suivre" })
  @ApiResponse({ status: 200, description: 'Follow retiré' })
  async unfollowUser(@Param('userId') userId: string, @Request() req: any) {
    return this.likesService.toggleFollow(req.user.id, userId);
  }

  // GET /likes/users/:userId/follow-status - Check if current user follows target user
  @Get('users/:userId/follow-status')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Vérifier si l'utilisateur courant suit un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur cible" })
  @ApiResponse({ status: 200, description: 'Statut de follow récupéré' })
  async getUserFollowStatus(
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.id;
    return this.likesService.getUserFollowStatus(userId, currentUserId);
  }

  // GET /likes/users/:userId/followers - Get user followers
  @Get('users/:userId/followers')
  @ApiOperation({ summary: "Récupérer les followers d'un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Followers récupérés' })
  async getUserFollowers(@Param('userId') userId: string) {
    const count = await this.likesService.getFollowersCount(userId);
    return { followers: count };
  }

  // GET /likes/users/:userId/following - Get who user follows
  @Get('users/:userId/following')
  @ApiOperation({ summary: "Récupérer qui l'utilisateur suit" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Following récupéré' })
  async getUserFollowing(@Param('userId') userId: string) {
    const count = await this.likesService.getFollowingCount(userId);
    return { following: count };
  }
}

