import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  // ============ EVENT LIKES ============

  /**
   * Toggle like on an event
   */
  async toggleEventLike(userId: string, eventId: string) {
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    // Check if user already liked this event
    const existingLike = await this.prisma.eventLike.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await this.prisma.eventLike.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return { liked: false, likes: await this.getEventLikesCount(eventId) };
    } else {
      // Like - create new like
      await this.prisma.eventLike.create({
        data: {
          userId,
          eventId,
        },
      });

      return { liked: true, likes: await this.getEventLikesCount(eventId) };
    }
  }

  /**
   * Get likes count for an event
   */
  async getEventLikesCount(eventId: string): Promise<number> {
    return this.prisma.eventLike.count({
      where: { eventId },
    });
  }

  /**
   * Check if user liked an event
   */
  async isEventLiked(userId: string, eventId: string): Promise<boolean> {
    const like = await this.prisma.eventLike.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
    return !!like;
  }

  /**
   * Get like status and count for an event
   */
  async getEventLikeStatus(eventId: string, userId?: string) {
    const [likes, userLike] = await Promise.all([
      this.getEventLikesCount(eventId),
      userId
        ? this.prisma.eventLike.findUnique({
            where: {
              userId_eventId: {
                userId,
                eventId,
              },
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      likes,
      isLiked: !!userLike,
    };
  }

  /**
   * Get all liked events for a user
   */
  async getUserLikedEvents(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.eventLike.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.eventLike.count({
        where: { userId },
      }),
    ]);

    // Get event details for each like
    const eventIds = likes.map((like) => like.eventId);
    const events = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      include: {
        organizer: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    const eventMap = new Map(events.map((e) => [e.id, e]));

    return {
      events: likes
        .map((like) => {
          const event = eventMap.get(like.eventId);
          if (!event) return null;
          return {
            id: event.id,
            title: event.title,
            slug: event.slug,
            coverImage: event.coverImage,
            startDate: event.startDate,
            venueName: event.venueName,
            venueCity: event.venueCity,
            minPrice: event.minPrice,
            maxPrice: event.maxPrice,
            organizer: event.organizer,
          };
        })
        .filter(Boolean),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============ ORGANIZER SUBSCRIPTIONS ============

  /**
   * Toggle subscription to an organizer's notifications
   */
  async toggleOrganizerSubscription(userId: string, organizerId: string) {
    // Check if organizer exists
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    // Check if user already subscribed
    const existingSubscription = await this.prisma.organizerSubscription.findUnique({
      where: {
        userId_organizerId: {
          userId,
          organizerId,
        },
      },
    });

    if (existingSubscription) {
      // Unsubscribe
      await this.prisma.organizerSubscription.delete({
        where: {
          userId_organizerId: {
            userId,
            organizerId,
          },
        },
      });

      return { subscribed: false, subscribers: await this.getOrganizerSubscribersCount(organizerId) };
    } else {
      // Subscribe
      await this.prisma.organizerSubscription.create({
        data: {
          userId,
          organizerId,
        },
      });

      return { subscribed: true, subscribers: await this.getOrganizerSubscribersCount(organizerId) };
    }
  }

  /**
   * Get subscribers count for an organizer
   */
  async getOrganizerSubscribersCount(organizerId: string): Promise<number> {
    return this.prisma.organizerSubscription.count({
      where: { organizerId },
    });
  }

  /**
   * Check if user subscribed to an organizer
   */
  async isOrganizerSubscribed(userId: string, organizerId: string): Promise<boolean> {
    const subscription = await this.prisma.organizerSubscription.findUnique({
      where: {
        userId_organizerId: {
          userId,
          organizerId,
        },
      },
    });
    return !!subscription;
  }

  /**
   * Get subscription status and count for an organizer
   */
  async getOrganizerSubscriptionStatus(organizerId: string, userId?: string) {
    const [subscribersCount, userSubscription] = await Promise.all([
      this.getOrganizerSubscribersCount(organizerId),
      userId
        ? this.prisma.organizerSubscription.findUnique({
            where: {
              userId_organizerId: {
                userId,
                organizerId,
              },
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      subscribers: subscribersCount,
      isFollowing: !!userSubscription,
    };
  }

  /**
   * Get all subscribed organizers for a user
   */
  async getUserSubscriptions(userId: string) {
    const subscriptions = await this.prisma.organizerSubscription.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get organizer details
    const organizerIds = subscriptions.map((sub) => sub.organizerId);
    const organizers = await this.prisma.organizer.findMany({
      where: { id: { in: organizerIds } },
      select: {
        id: true,
        companyName: true,
        logo: true,
        description: true,
      },
    });

    const organizerMap = new Map(organizers.map((o) => [o.id, o]));

    return {
      organizers: subscriptions
        .map((sub) => organizerMap.get(sub.organizerId))
        .filter(Boolean),
      total: subscriptions.length,
    };
  }

  // ============ USER FOLLOW (SOCIAL) ============

  /**
   * Follow/unfollow a user
   */
  async toggleFollow(followerId: string, followingId: string) {
    // Cannot follow yourself
    if (followerId === followingId) {
      throw new ConflictException('Vous ne pouvez pas vous suivre vous-même');
    }

    // Check if user to follow exists
    const userToFollow = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Check if already following
    const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await this.prisma.userFollow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return { following: false };
    } else {
      // Follow
      await this.prisma.userFollow.create({
        data: {
          followerId,
          followingId,
        },
      });

      return { following: true };
    }
  }

  /**
   * Check if user is following another user
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  }

  /**
   * Get followers count for a user
   */
  async getFollowersCount(userId: string): Promise<number> {
    return this.prisma.userFollow.count({
      where: { followingId: userId },
    });
  }

  /**
   * Get following count for a user
   */
  async getFollowingCount(userId: string): Promise<number> {
    return this.prisma.userFollow.count({
      where: { followerId: userId },
    });
  }

  /**
   * Get user profile with follow status
   */
  async getUserFollowStatus(targetUserId: string, currentUserId?: string) {
    const [followersCount, followingCount, isFollowing] = await Promise.all([
      this.getFollowersCount(targetUserId),
      this.getFollowingCount(targetUserId),
      currentUserId ? this.isFollowing(currentUserId, targetUserId) : Promise.resolve(false),
    ]);

    return {
      followers: followersCount,
      following: followingCount,
      isFollowing,
    };
  }
}

