import { db } from './db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export interface AuditLogData {
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  static async log(data: AuditLogData, request?: Request): Promise<void> {
    try {
      let userId = 'system';
      
      if (request) {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
          const user = await db.user.findUnique({
            where: { email: session.user.email },
          });
          if (user) {
            userId = user.id;
          }
        }
      }

      await db.auditLog.create({
        data: {
          userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  static async getUserActivity(userId: string, limit: number = 50): Promise<any[]> {
    return db.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async getResourceActivity(resource: string, resourceId: string, limit: number = 50): Promise<any[]> {
    return db.auditLog.findMany({
      where: {
        resource,
        resourceId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
} 