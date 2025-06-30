'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Code, 
  Brain, 
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Search,
  FileText,
  Video,
  MessageCircle,
  Star,
  Download,
  ExternalLink,
  ChevronRight,
  Play,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  {
    name: "Getting Started",
    icon: Play,
    color: "from-blue-500 to-cyan-600",
    articles: [
      { title: "Quick Start Guide", time: "5 min read", difficulty: "Beginner" },
      { title: "Setting Up Your Environment", time: "10 min read", difficulty: "Beginner" },
      { title: "Your First Problem", time: "15 min read", difficulty: "Beginner" }
    ]
  },
  {
    name: "Core Features",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
    articles: [
      { title: "AI Code Analysis", time: "8 min read", difficulty: "Intermediate" },
      { title: "Personalized Learning Paths", time: "12 min read", difficulty: "Intermediate" },
      { title: "Smart Note-Taking", time: "10 min read", difficulty: "Intermediate" }
    ]
  },
  {
    name: "Contests & Challenges",
    icon: Trophy,
    color: "from-yellow-500 to-orange-600",
    articles: [
      { title: "Participating in Contests", time: "7 min read", difficulty: "Intermediate" },
      { title: "Leaderboard & Rankings", time: "6 min read", difficulty: "Beginner" },
      { title: "Contest Strategies", time: "15 min read", difficulty: "Advanced" }
    ]
  },
  {
    name: "Advanced Topics",
    icon: Brain,
    color: "from-green-500 to-emerald-600",
    articles: [
      { title: "Custom Problem Sets", time: "12 min read", difficulty: "Advanced" },
      { title: "API Integration", time: "20 min read", difficulty: "Advanced" },
      { title: "Team Collaboration", time: "10 min read", difficulty: "Intermediate" }
    ]
  }
];

const quickActions = [
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    icon: Video,
    color: "from-red-500 to-pink-600",
    link: "/docs/videos"
  },
  {
    title: "API Reference",
    description: "Complete API documentation",
    icon: Code,
    color: "from-blue-500 to-purple-600",
    link: "/docs/api"
  },
  {
    title: "Community Forum",
    description: "Get help from the community",
    icon: MessageCircle,
    color: "from-green-500 to-teal-600",
    link: "/community"
  },
  {
    title: "Download SDK",
    description: "Integrate CodeNote into your app",
    icon: Download,
    color: "from-yellow-500 to-orange-600",
    link: "/docs/sdk"
  }
];

const popularArticles = [
  {
    title: "How to Use AI Code Suggestions",
    category: "Core Features",
    views: "2.5K",
    rating: 4.9,
    time: "8 min read"
  },
  {
    title: "Mastering Dynamic Programming",
    category: "Advanced Topics",
    views: "1.8K",
    rating: 4.8,
    time: "25 min read"
  },
  {
    title: "Contest Preparation Guide",
    category: "Contests & Challenges",
    views: "3.2K",
    rating: 4.7,
    time: "15 min read"
  },
  {
    title: "Setting Up Your Study Plan",
    category: "Getting Started",
    views: "4.1K",
    rating: 4.9,
    time: "12 min read"
  }
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Documentation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Learn
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Everything
              </span>
              {" "}About CodeNote
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Comprehensive guides, tutorials, and resources to help you master 
              data structures and algorithms with our AI-powered platform.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Quick Actions</h2>
            <p className="text-xl text-muted-foreground">
              Get started quickly with these popular resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={action.link}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Documentation Categories</h2>
            <p className="text-xl text-muted-foreground">
              Explore our comprehensive guides and tutorials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <category.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <p className="text-muted-foreground">{category.articles.length} articles</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <motion.div
                          key={article.title}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + articleIndex * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium group-hover:text-primary transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground">{article.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {article.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Popular Articles</h2>
            <p className="text-xl text-muted-foreground">
              Most read and highly rated documentation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{article.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Need More Help?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help 
              you get the most out of CodeNote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Community Forum
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 