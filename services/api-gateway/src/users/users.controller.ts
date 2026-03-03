import { Controller, Get, Patch, Body, Request, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/stats — Stats de l'utilisateur connecté
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Statistiques de l'utilisateur connecté" })
  async getMyStats(@Request() req: any) {
    return this.usersService.getUserStats(req.user.id);
  }

  // GET /users/preferences — Préférences de l'utilisateur
  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Préférences de l'utilisateur connecté" })
  async getPreferences(@Request() req: any) {
    return this.usersService.getUserPreferences(req.user.id);
  }

  // PATCH /users/preferences — Mettre à jour les préférences
  @Patch('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mettre à jour les préférences" })
  async updatePreferences(@Request() req: any, @Body() body: any) {
    return this.usersService.updateUserPreferences(req.user.id, body);
  }

  // GET /users/me — Profil de l'utilisateur connecté
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Profil de l'utilisateur connecté" })
  async getMe(@Request() req: any) {
    return this.usersService.getUserProfile(req.user.id);
  }

  // PATCH /users/me — Mettre à jour le profil
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mettre à jour le profil" })
  async updateMe(@Request() req: any, @Body() body: any) {
    return this.usersService.updateUserProfile(req.user.id, body);
  }

  // GET /users/:userId/public — Profil public d'un utilisateur (sans auth)
  @Get(':userId/public')
  @ApiOperation({ summary: "Profil public d'un utilisateur" })
  async getPublicProfile(@Param('userId') userId: string) {
    return this.usersService.getPublicProfile(userId);
  }
}
