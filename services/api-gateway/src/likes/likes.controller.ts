import { Controller, Post, Delete, Get, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // ============ EVENT LIKES ============

  @Post('events/:eventId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async likeEvent(@Request() req, @Param('eventId') eventId: string) {
    return this.likesService.likeEvent(req.user.id, eventId);
  }

  @Delete('events/:eventId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unlikeEvent(@Request() req, @Param('eventId') eventId: string) {
    return this.likesService.unlikeEvent(req.user.id, eventId);
  }

  @Get('events/:eventId/status')
  @UseGuards(JwtAuthGuard)
  async isEventLiked(@Request() req, @Param('eventId') eventId: string) {
    return this.likesService.isEventLiked(req.user.id, eventId);
  }

  @Get('events/:eventId/count')
  async getEventLikesCount(@Param('eventId') eventId: string) {
    return this.likesService.getEventLikesCount(eventId);
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  async getUserLikedEvents(@Request() req) {
    return this.likesService.getUserLikedEvents(req.user.id);
  }

  // ============ ORGANIZER FOLLOWS ============

  @Post('organizers/:organizerId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async followOrganizer(@Request() req, @Param('organizerId') organizerId: string) {
    return this.likesService.followOrganizer(req.user.id, organizerId);
  }

  @Delete('organizers/:organizerId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unfollowOrganizer(@Request() req, @Param('organizerId') organizerId: string) {
    return this.likesService.unfollowOrganizer(req.user.id, organizerId);
  }

  @Get('organizers/:organizerId/follow-status')
  @UseGuards(JwtAuthGuard)
  async isOrganizerFollowed(@Request() req, @Param('organizerId') organizerId: string) {
    return this.likesService.isOrganizerFollowed(req.user.id, organizerId);
  }

  @Get('organizers/:organizerId/followers-count')
  async getOrganizerFollowersCount(@Param('organizerId') organizerId: string) {
    return this.likesService.getOrganizerFollowersCount(organizerId);
  }

  @Get('my-following')
  @UseGuards(JwtAuthGuard)
  async getUserFollowedOrganizers(@Request() req) {
    return this.likesService.getUserFollowedOrganizers(req.user.id);
  }

  // ============ ORGANIZER SUBSCRIPTIONS ============

  @Post('organizers/:organizerId/subscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async subscribeToOrganizer(@Request() req, @Param('organizerId') organizerId: string) {
    return this.likesService.subscribeToOrganizer(req.user.id, organizerId);
  }

  @Delete('organizers/:organizerId/subscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsubscribeFromOrganizer(@Request() req, @Param('organizerId') organizerId: string) {
    return this.likesService.unsubscribeFromOrganizer(req.user.id, organizerId);
  }

  @Get('my-subscriptions')
  @UseGuards(JwtAuthGuard)
  async getUserSubscriptions(@Request() req) {
    return this.likesService.getUserSubscriptions(req.user.id);
  }

  // ============ USER FOLLOWS ============

  @Post('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async followUser(@Request() req, @Param('userId') userId: string) {
    return this.likesService.followUser(req.user.id, userId);
  }

  @Delete('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unfollowUser(@Request() req, @Param('userId') userId: string) {
    return this.likesService.unfollowUser(req.user.id, userId);
  }

  @Get('users/:userId/follow-status')
  @UseGuards(JwtAuthGuard)
  async isFollowing(@Request() req, @Param('userId') userId: string) {
    return this.likesService.isFollowing(req.user.id, userId);
  }

  @Get('users/:userId/followers')
  async getUserFollowers(@Param('userId') userId: string) {
    return this.likesService.getUserFollowers(userId);
  }

  @Get('users/:userId/following')
  async getUserFollowing(@Param('userId') userId: string) {
    return this.likesService.getUserFollowing(userId);
  }
}

