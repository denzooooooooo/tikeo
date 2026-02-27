import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  // ============ EVENT LIKES ============

  async likeEvent(userId: string, eventId: string) {
    // Check if event exists
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    // Check if already liked
    const existingLike = await this.prisma.eventLike.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existingLike) {
      throw new BadRequestException('Vous avez déjà liké cet événement');
    }

    // Create like
    await this.prisma.eventLike.create({
      data: { userId, eventId },
    });

    // Update event likes count using SQL-like approach via raw query or count
    const currentLikes = await this.prisma.eventLike.count({
      where: { eventId },
    });
    await this.prisma.event.update({
      where: { id: eventId },
      data: { likes: currentLikes },
    });

    return { success: true, message: 'Événement liké avec succès' };
  }

  async unlikeEvent(userId: string, eventId: string) {
    const existingLike = await this.prisma.eventLike.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!existingLike) {
      throw new BadRequestException("Vous n'avez pas liké cet événement");
    }

    // Delete like
    await this.prisma.eventLike.delete({
      where: { id: existingLike.id },
    });

    // Update event likes count using count
    const currentLikes = await this.prisma.eventLike.count({
      where: { eventId },
    });
    await this.prisma.event.update({
      where: { id: eventId },
      data: { likes: currentLikes },
    });

    return { success: true, message: 'Like retiré avec succès' };
  }

  async isEventLiked(userId: string, eventId: string) {
    const like = await this.prisma.eventLike.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    return { isLiked: !!like };
  }

  async getEventLikesCount(eventId: string) {
    const count = await this.prisma.eventLike.count({
      where: { eventId },
    });
    return { count };
  }

  async getUserLikedEvents(userId: string) {
    return this.prisma.eventLike.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              select: { id: true, companyName: true, logo: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============ ORGANIZER LIKES/FOLLOWS ============

  async followOrganizer(userId: string, organizerId: string) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id: organizerId } });
    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    const existingLike = await this.prisma.organizerLike.findUnique({
      where: {
        userId_organizerId: { userId, organizerId },
      },
    });

    if (existingLike) {
      throw new BadRequestException('Vous suivez déjà cet organisateur');
    }

    await this.prisma.organizerLike.create({
      data: { userId, organizerId },
    });

    // Update followers count using count
    const currentFollowers = await this.prisma.organizerLike.count({
      where: { organizerId },
    });
    await this.prisma.organizer.update({
      where: { id: organizerId },
      data: { followersCount: currentFollowers },
    });

    return { success: true, message: 'Vous suivez cet organisateur' };
  }

  async unfollowOrganizer(userId: string, organizerId: string) {
    const existingLike = await this.prisma.organizerLike.findUnique({
      where: {
        userId_organizerId: { userId, organizerId },
      },
    });

    if (!existingLike) {
      throw new BadRequestException("Vous ne suivez pas cet organisateur");
    }

    await this.prisma.organizerLike.delete({
      where: { id: existingLike.id },
    });

    // Update followers count using count
    const currentFollowers = await this.prisma.organizerLike.count({
      where: { organizerId },
    });
    await this.prisma.organizer.update({
      where: { id: organizerId },
      data: { followersCount: currentFollowers },
    });

    return { success: true, message: 'Vous ne suivez plus cet organisateur' };
  }

  async isOrganizerFollowed(userId: string, organizerId: string) {
    const follow = await this.prisma.organizerLike.findUnique({
      where: {
        userId_organizerId: { userId, organizerId },
      },
    });
    return { isFollowed: !!follow };
  }

  async getOrganizerFollowersCount(organizerId: string) {
    const count = await this.prisma.organizerLike.count({
      where: { organizerId },
    });
    return { count };
  }

  async getUserFollowedOrganizers(userId: string) {
    return this.prisma.organizerLike.findMany({
      where: { userId },
      include: {
        organizer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============ ORGANIZER SUBSCRIPTIONS ============

  async subscribeToOrganizer(userId: string, organizerId: string) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id: organizerId } });
    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    const existing = await this.prisma.organizerSubscription.findUnique({
      where: {
        userId_organizerId: { userId, organizerId },
      },
    });

    if (existing) {
      throw new BadRequestException('Vous êtes déjà abonné');
    }

    await this.prisma.organizerSubscription.create({
      data: { userId, organizerId },
    });

    return { success: true, message: 'Abonnement réussi' };
  }

  async unsubscribeFromOrganizer(userId: string, organizerId: string) {
    const existing = await this.prisma.organizerSubscription.findUnique({
      where: {
        userId_organizerId: { userId, organizerId },
      },
    });

    if (!existing) {
      throw new BadRequestException("Vous n'êtes pas abonné");
    }

    await this.prisma.organizerSubscription.delete({
      where: { id: existing.id },
    });

    return { success: true, message: 'Désabonnement réussi' };
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.organizerSubscription.findMany({
      where: { userId },
      include: {
        organizer: true,
      },
    });
  }

  // ============ USER FOLLOWS ============

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("Vous ne pouvez pas vous suivre vous-même");
    }

    const existing = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      throw new BadRequestException('Vous suivez déjà cet utilisateur');
    }

    await this.prisma.userFollow.create({
      data: { followerId, followingId },
    });

    return { success: true, message: 'Utilisateur suivi' };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const existing = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (!existing) {
      throw new BadRequestException("Vous ne suivez pas cet utilisateur");
    }

    await this.prisma.userFollow.delete({
      where: { id: existing.id },
    });

    return { success: true, message: 'Utilisateur non suivi' };
  }

  async getUserFollowers(userId: string) {
    return this.prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }

  async getUserFollowing(userId: string) {
    return this.prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return { isFollowing: !!follow };
  }
}

