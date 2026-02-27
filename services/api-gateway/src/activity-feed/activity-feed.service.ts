import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateActivityDto {
  userId: string;
  type: 'LIKE' | 'FOLLOW' | 'REVIEW' | 'PURCHASE' | 'CONTEST_VOTE' | 'EVENT_CREATED';
  eventId?: string;
  organizerId?: string;
  contestId?: string;
  contestantId?: string;
  message: string;
}

@Injectable()
export class ActivityFeedService {
  private readonly logger = new Logger(ActivityFeedService.name);

  constructor(private prisma: PrismaService) {}

  async createActivity(dto: CreateActivityDto) {
    try {
      const activity = await this.prisma.activity.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          eventId: dto.eventId,
          organizerId: dto.organizerId,
          contestId: dto.contestId,
          contestantId: dto.contestantId,
          message: dto.message,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          organizer: {
            select: {
              id: true,
              companyName: true,
              logo: true,
            },
          },
          contest: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return activity;
    } catch (error) {
      this.logger.error('Error creating activity: ' + error);
      throw error;
    }
  }

  async getUserActivity(userId: string, limit = 20, offset = 0) {
    try {
      // Get users that the current user follows
      const following = await this.prisma.userFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map(f => f.followingId);
      
      // Get organizers that the user follows
      const subscribedOrganizers = await this.prisma.organizerSubscription.findMany({
        where: { userId },
        select: { organizerId: true },
      });
      
      const organizerIds = subscribedOrganizers.map(s => s.organizerId);

      // Get activities from followed users and organizers
      const activities = await this.prisma.activity.findMany({
        where: {
          OR: [
            { userId: { in: followingIds } },
            { organizerId: { in: organizerIds } },
            { userId },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          organizer: {
            select: {
              id: true,
              companyName: true,
              logo: true,
            },
          },
          contest: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return activities;
    } catch (error) {
      this.logger.error('Error getting user activity: ' + error);
      throw error;
    }
  }

  async getGlobalActivity(limit = 20, offset = 0) {
    try {
      const activities = await this.prisma.activity.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          organizer: {
            select: {
              id: true,
              companyName: true,
              logo: true,
            },
          },
          contest: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return activities;
    } catch (error) {
      this.logger.error('Error getting global activity: ' + error);
      throw error;
    }
  }

  async getActivityStats() {
    try {
      const totalActivities = await this.prisma.activity.count();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayActivities = await this.prisma.activity.count({
        where: {
          createdAt: { gte: today },
        },
      });

      return {
        totalActivities,
        todayActivities,
      };
    } catch (error) {
      this.logger.error('Error getting activity stats: ' + error);
      throw error;
    }
  }
}

