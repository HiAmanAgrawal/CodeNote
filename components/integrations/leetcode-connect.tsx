'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trophy,
  Target,
  TrendingUp,
  Code,
  Star
} from 'lucide-react';

interface LeetCodeConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function LeetCodeConnect({ isOpen, onClose, onSuccess }: LeetCodeConnectProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const steps = [
    { id: 1, title: 'Enter Username', description: 'Provide your LeetCode username' },
    { id: 2, title: 'Verify Account', description: 'Confirm your LeetCode profile' },
    { id: 3, title: 'Import Data', description: 'Sync your problem history' }
  ];

  const mockUserData = {
    username: 'john_doe',
    rank: 1250,
    solved: 156,
    total: 2000,
    rating: 1850,
    submissions: 2340,
    acceptanceRate: 87.5,
    recentProblems: [
      { title: 'Two Sum', difficulty: 'Easy', status: 'Solved', date: '2024-01-15' },
      { title: 'Add Two Numbers', difficulty: 'Medium', status: 'Solved', date: '2024-01-14' },
      { title: 'Longest Substring', difficulty: 'Medium', status: 'Attempted', date: '2024-01-13' }
    ]
  };

  const handleVerify = async () => {
    if (!username.trim()) {
      setError('Please enter a valid username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserData(mockUserData);
      setStep(2);
    } catch (err) {
      setError('Username not found. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    
    try {
      // Simulate import process
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Update progress
      }
      
      setStep(3);
      onSuccess(userData);
    } catch (err) {
      setError('Import failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="relative pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <CardTitle className="text-2xl font-bold text-center">
                  Connect LeetCode Account
                </CardTitle>
                <p className="text-muted-foreground text-center">
                  Import your LeetCode progress and continue learning
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  {steps.map((s, index) => (
                    <div key={s.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step >= s.id 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-muted-foreground text-muted-foreground'
                      }`}>
                        {step > s.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{s.id}</span>
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 ${
                          step > s.id ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium">LeetCode Username</label>
                        <Input
                          placeholder="Enter your LeetCode username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                        />
                      </div>
                      
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                        >
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">{error}</span>
                        </motion.div>
                      )}

                      <Button
                        onClick={handleVerify}
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify Account'
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && userData && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* User Profile */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">@{userData.username}</h3>
                            <p className="text-sm text-muted-foreground">LeetCode Profile</p>
                          </div>
                          <Badge variant="secondary">Rank {userData.rank}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{userData.solved}</div>
                            <div className="text-sm text-muted-foreground">Problems Solved</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userData.rating}</div>
                            <div className="text-sm text-muted-foreground">Rating</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Problems */}
                      <div>
                        <h4 className="font-medium mb-3">Recent Problems</h4>
                        <div className="space-y-2">
                          {userData.recentProblems.map((problem: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{problem.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={problem.difficulty === 'Easy' ? 'default' : 'secondary'}>
                                  {problem.difficulty}
                                </Badge>
                                <Badge variant={problem.status === 'Solved' ? 'default' : 'outline'}>
                                  {problem.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleImport}
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Importing Data...
                          </>
                        ) : (
                          'Import Data'
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center space-y-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                      >
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </motion.div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Connection Successful!</h3>
                        <p className="text-muted-foreground">
                          Your LeetCode data has been imported successfully. You can now track your progress and get personalized recommendations.
                        </p>
                      </div>

                      <Button onClick={onClose} className="w-full">
                        Continue to Dashboard
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 