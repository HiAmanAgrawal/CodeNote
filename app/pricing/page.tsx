'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  Users,
  Brain,
  Trophy,
  BookOpen,
  Code,
  Target,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started with DSA learning",
    features: [
      "Access to 100+ basic problems",
      "Basic code editor",
      "Community support",
      "Progress tracking",
      "Basic note-taking"
    ],
    icon: BookOpen,
    color: "from-blue-500 to-cyan-600",
    popular: false
  },
  {
    name: "Pro",
    price: { monthly: 19, yearly: 190 },
    description: "Advanced features for serious learners",
    features: [
      "Access to 1000+ problems",
      "AI-powered code analysis",
      "Personalized learning paths",
      "Advanced note-taking with AI",
      "Priority support",
      "Contest participation",
      "Detailed analytics",
      "Custom study plans"
    ],
    icon: Crown,
    color: "from-purple-500 to-pink-600",
    popular: true
  },
  {
    name: "Enterprise",
    price: { monthly: 49, yearly: 490 },
    description: "Complete solution for teams and organizations",
    features: [
      "Everything in Pro",
      "Team management",
      "Custom problem sets",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Dedicated support",
      "Custom integrations"
    ],
    icon: Sparkles,
    color: "from-yellow-500 to-orange-600",
    popular: false
  }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized recommendations and intelligent analysis",
    free: false,
    pro: true,
    enterprise: true
  },
  {
    icon: Code,
    title: "Advanced Code Editor",
    description: "Monaco Editor with syntax highlighting and debugging",
    free: false,
    pro: true,
    enterprise: true
  },
  {
    icon: Trophy,
    title: "Live Contests",
    description: "Participate in real-time coding competitions",
    free: false,
    pro: true,
    enterprise: true
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description: "Detailed analytics and performance insights",
    free: true,
    pro: true,
    enterprise: true
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team members",
    free: false,
    pro: false,
    enterprise: true
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Integrate CodeNote into your own applications",
    free: false,
    pro: false,
    enterprise: true
  }
];

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your billing cycle."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all paid plans come with a 7-day free trial. No credit card required to start."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

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
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Choose Your Plan</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Simple,
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Transparent
              </span>
              {" "}Pricing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Choose the perfect plan for your DSA learning journey. 
              All plans include our core features with no hidden fees.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <motion.button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
                  isYearly ? 'bg-primary' : 'bg-muted'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: isYearly ? 32 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}
                
                <Card className={`h-full border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-xl scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <plan.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold">
                          ${isYearly ? plan.price.yearly : plan.price.monthly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-muted-foreground">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {plan.price.monthly > 0 && isYearly && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ${plan.price.monthly}/month when billed monthly
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-primary' : 'bg-secondary'}`}
                        variant={plan.popular ? 'default' : 'secondary'}
                        asChild
                      >
                        <Link href={plan.price.monthly === 0 ? '/dashboard' : '/signup'}>
                          {plan.price.monthly === 0 ? 'Get Started Free' : 'Choose Plan'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              See what's included in each plan
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <motion.tr
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <feature.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{feature.title}</div>
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center p-4">
                      {feature.free ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {feature.pro ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {feature.enterprise ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
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
              Ready to Start Your DSA Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already mastering algorithms 
              with our AI-powered platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/dashboard">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 