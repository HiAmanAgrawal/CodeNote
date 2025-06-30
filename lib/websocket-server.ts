import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { redis } from './redis';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './db';

export interface ContestSocket {
  contestId: string;
  userId: string;
  userName: string;
}

export class WebSocketServer {
  private io: SocketIOServer;
  private contestRooms: Map<string, Set<string>> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupRedisSubscriptions();
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        // Get session from handshake auth
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
          return next(new Error('Authentication required'));
        }

        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.data.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.data.user.name} connected`);

      // Join contest room
      socket.on('join-contest', async (contestId: string) => {
        try {
          // Check if user is participant
          const participant = await prisma.contestParticipant.findFirst({
            where: {
              contestId,
              userId: socket.data.user.id,
            },
          });

          if (!participant) {
            socket.emit('error', 'You are not a participant in this contest');
            return;
          }

          socket.join(`contest:${contestId}`);
          
          // Track user in contest room
          if (!this.contestRooms.has(contestId)) {
            this.contestRooms.set(contestId, new Set());
          }
          this.contestRooms.get(contestId)!.add(socket.data.user.id);

          // Send current contest status
          const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: {
              participants: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                orderBy: { score: 'desc' },
              },
            },
          });

          if (contest) {
            socket.emit('contest-status', {
              contest,
              participantCount: contest.participants.length,
              userRank: contest.participants.findIndex(p => p.userId === socket.data.user.id) + 1,
            });
          }

          console.log(`User ${socket.data.user.name} joined contest ${contestId}`);
        } catch (error) {
          socket.emit('error', 'Failed to join contest');
        }
      });

      // Leave contest room
      socket.on('leave-contest', (contestId: string) => {
        socket.leave(`contest:${contestId}`);
        
        if (this.contestRooms.has(contestId)) {
          this.contestRooms.get(contestId)!.delete(socket.data.user.id);
        }

        console.log(`User ${socket.data.user.name} left contest ${contestId}`);
      });

      // Submit code
      socket.on('submit-code', async (data: {
        contestId: string;
        problemId: string;
        code: string;
      })) {
        // Implementation of submit-code event handler
      }
    });
  }

  private setupRedisSubscriptions() {
    // Implementation of setupRedisSubscriptions method
  }
} 