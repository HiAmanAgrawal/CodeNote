import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ContestSocketData {
  contestId: string;
  participantCount: number;
  userRank: number;
  leaderboard: any[];
  submissions: any[];
}

export function useContestSocket(contestId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001/contests/${contestId}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [contestId]);

  return socket;
} 