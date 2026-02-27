import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'placeholder-github-client-id',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'placeholder-github-client-secret',
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') || 'http://localhost:3001/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const { username, emails, photos } = profile;
    
    return {
      email: emails[0].value,
      firstName: profile.displayName?.split(' ')[0] || username,
      lastName: profile.displayName?.split(' ')[1] || '',
      avatar: photos[0].value,
      provider: 'github',
      providerId: profile.id,
    };
  }
}
