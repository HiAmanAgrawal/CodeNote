'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  Stop, 
  AlertTriangle, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface ContestTimerProps {
  startTime: Date;
  endTime: Date;
  onTimeUp?: () => void;
  onWarning?: (timeLeft: number) => void;
  isActive?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const ContestTimer: React.FC<ContestTimerProps> = ({
  startTime,
  endTime,
  onTimeUp,
  onWarning,
  isActive = true,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        total: difference,
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }, [endTime]);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  const getProgressPercentage = (): number => {
    const totalDuration = new Date(endTime).getTime() - new Date(startTime).getTime();
    const elapsed = totalDuration - timeLeft.total;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const getTimeStatus = (): 'upcoming' | 'active' | 'warning' | 'critical' | 'ended' => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return 'upcoming';
    if (now >= start && now < end) {
      if (timeLeft.total <= 5 * 60 * 1000) return 'critical'; // 5 minutes
      if (timeLeft.total <= 15 * 60 * 1000) return 'warning'; // 15 minutes
      return 'active';
    }
    return 'ended';
  };

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
    toast.success('Contest timer started!');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Timer resumed' : 'Timer paused');
  };

  const handleStop = () => {
    setIsStarted(false);
    setIsPaused(false);
    toast.warning('Timer stopped');
  };

  useEffect(() => {
    if (!isActive || !isStarted || isPaused) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check for warnings
      if (newTimeLeft.total <= 15 * 60 * 1000 && !warningShown) { // 15 minutes
        setWarningShown(true);
        onWarning?.(newTimeLeft.total);
        toast.warning('Less than 15 minutes remaining!', {
          duration: 5000,
          icon: <AlertTriangle className="h-4 w-4" />,
        });
      }

      if (newTimeLeft.total <= 5 * 60 * 1000) { // 5 minutes
        toast.error('Critical time remaining!', {
          duration: 3000,
          icon: <AlertTriangle className="h-4 w-4" />,
        });
      }

      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
        onTimeUp?.();
        toast.error('Time is up! Contest has ended.', {
          duration: 10000,
          icon: <Stop className="h-4 w-4" />,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isStarted, isPaused, calculateTimeLeft, onTimeUp, onWarning, warningShown]);

  // Initialize time left
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  const status = getTimeStatus();
  const progressPercentage = getProgressPercentage();

  const statusConfig = {
    upcoming: {
      color: 'bg-blue-500',
      text: 'text-blue-600',
      icon: Clock,
      label: 'Upcoming',
    },
    active: {
      color: 'bg-green-500',
      text: 'text-green-600',
      icon: Play,
      label: 'Active',
    },
    warning: {
      color: 'bg-yellow-500',
      text: 'text-yellow-600',
      icon: AlertTriangle,
      label: 'Warning',
    },
    critical: {
      color: 'bg-red-500',
      text: 'text-red-600',
      icon: AlertTriangle,
      label: 'Critical',
    },
    ended: {
      color: 'bg-gray-500',
      text: 'text-gray-600',
      icon: CheckCircle,
      label: 'Ended',
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Contest Timer</span>
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`flex items-center space-x-1 ${config.text}`}
          >
            <config.icon className="h-3 w-3" />
            <span>{config.label}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Time Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            {status === 'upcoming' ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Contest starts in</p>
                <div className="flex justify-center space-x-4">
                  <TimeUnit value={timeLeft.days} label="Days" />
                  <TimeUnit value={timeLeft.hours} label="Hours" />
                  <TimeUnit value={timeLeft.minutes} label="Minutes" />
                  <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            ) : status === 'ended' ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Contest has ended</p>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Completed</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Time remaining</p>
                <div className="flex justify-center space-x-4">
                  <TimeUnit value={timeLeft.hours} label="Hours" />
                  <TimeUnit value={timeLeft.minutes} label="Minutes" />
                  <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {status === 'active' && (
          <div className="flex justify-center space-x-2">
            {!isStarted ? (
              <Button onClick={handleStart} className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Start Timer</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handlePause}
                  className="flex items-center space-x-2"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleStop}
                  className="flex items-center space-x-2"
                >
                  <Stop className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Start: {new Date(startTime).toLocaleTimeString()}</span>
          <span>End: {new Date(endTime).toLocaleTimeString()}</span>
        </div>

        {/* Warning Messages */}
        <AnimatePresence>
          {status === 'warning' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Less than 15 minutes remaining!
              </span>
            </motion.div>
          )}
          
          {status === 'critical' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              <Zap className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">
                Critical time remaining! Submit your solutions now!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

// Time Unit Component
interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl font-bold tabular-nums">
      {formatTime(value)}
    </div>
    <div className="text-xs text-muted-foreground uppercase tracking-wide">
      {label}
    </div>
  </div>
);

export default ContestTimer; 