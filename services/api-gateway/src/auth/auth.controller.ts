import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google - redirects to Google' })
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with tokens' })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const tokens = await this.authService.validateOAuthUser(req.user);
      const params = new URLSearchParams({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        provider: 'google',
      });
      return res.redirect(`${FRONTEND_URL}/auth/callback?${params.toString()}`);
    } catch (error) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub - redirects to GitHub' })
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with tokens' })
  async githubAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const tokens = await this.authService.validateOAuthUser(req.user);
      const params = new URLSearchParams({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        provider: 'github',
      });
      return res.redirect(`${FRONTEND_URL}/auth/callback?${params.toString()}`);
    } catch (error) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token from email' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }
}

