'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Award
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface ProgressData {
  date: string;
  problemsSolved: number;
  accuracy: number;
  timeSpent: number;
  rating: number;
  streak: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  type?: 'line' | 'area' | 'bar' | 'radar';
  metric?: 'problemsSolved' | 'accuracy' | 'timeSpent' | 'rating' | 'streak';
  timeRange?: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

const chartTypes = {
  line: { icon: LineChart, label: 'Line Chart' },
  area: { icon: BarChart3, label: 'Area Chart' },
  bar: { icon: BarChart3, label: 'Bar Chart' },
  radar: { icon: Activity, label: 'Radar Chart' },
};

const metrics = {
  problemsSolved: { label: 'Problems Solved', color: '#3b82f6', unit: 'problems' },
  accuracy: { label: 'Accuracy', color: '#10b981', unit: '%' },
  timeSpent: { label: 'Time Spent', color: '#f59e0b', unit: 'hours' },
  rating: { label: 'Rating', color: '#8b5cf6', unit: 'points' },
  streak: { label: 'Streak', color: '#ef4444', unit: 'days' },
};

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  type = 'line',
  metric = 'problemsSolved',
  timeRange = '30d',
  className,
}) => {
  const [selectedType, setSelectedType] = useState(type);
  const [selectedMetric, setSelectedMetric] = useState(metric);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const filteredData = useMemo(() => {
    const now = new Date();
    const daysToSubtract = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[selectedTimeRange] || 30;

    const cutoffDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);

    return data
      .filter(item => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedTimeRange]);

  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: item[selectedMetric],
      fullDate: item.date,
    }));
  }, [filteredData, selectedMetric]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map(d => d.value);
    const current = values[values.length - 1];
    const previous = values[values.length - 2] || 0;
    const change = current - previous;
    const changePercent = previous > 0 ? (change / previous) * 100 : 0;
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      current,
      change,
      changePercent,
      average,
      max,
      min,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  }, [chartData]);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const renderChart = () => {
    const metricConfig = metrics[selectedMetric];

    switch (selectedType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `${value}${metricConfig.unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [`${value}${metricConfig.unit}`, metricConfig.label]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={metricConfig.color}
                strokeWidth={3}
                dot={{ fill: metricConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: metricConfig.color, strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `${value}${metricConfig.unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [`${value}${metricConfig.unit}`, metricConfig.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={metricConfig.color}
                fill={metricConfig.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `${value}${metricConfig.unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [`${value}${metricConfig.unit}`, metricConfig.label]}
              />
              <Bar
                dataKey="value"
                fill={metricConfig.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'radar':
        // For radar chart, we need to transform data to show multiple metrics
        const radarData = [
          {
            metric: 'Problems Solved',
            value: Math.max(...data.map(d => d.problemsSolved)),
            fullMark: Math.max(...data.map(d => d.problemsSolved)) * 1.2,
          },
          {
            metric: 'Accuracy',
            value: Math.max(...data.map(d => d.accuracy)),
            fullMark: 100,
          },
          {
            metric: 'Time Spent',
            value: Math.max(...data.map(d => d.timeSpent)),
            fullMark: Math.max(...data.map(d => d.timeSpent)) * 1.2,
          },
          {
            metric: 'Rating',
            value: Math.max(...data.map(d => d.rating)),
            fullMark: Math.max(...data.map(d => d.rating)) * 1.2,
          },
          {
            metric: 'Streak',
            value: Math.max(...data.map(d => d.streak)),
            fullMark: Math.max(...data.map(d => d.streak)) * 1.2,
          },
        ];

        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>Progress Chart</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(chartTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <config.icon className="h-4 w-4" />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metrics).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
                <SelectItem value="1y">1y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Summary */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats.current}
                <span className="text-sm text-muted-foreground ml-1">
                  {metrics[selectedMetric].unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold flex items-center justify-center space-x-1 ${
                stats.trend === 'up' ? 'text-green-600' : 
                stats.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${stats.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{Math.abs(stats.changePercent).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Change</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">
                {stats.average.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">
                  {metrics[selectedMetric].unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Average</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold">
                {stats.max}
                <span className="text-sm text-muted-foreground ml-1">
                  {metrics[selectedMetric].unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Best</div>
            </div>
          </motion.div>
        )}

        {/* Chart */}
        <div className="border rounded-lg p-4 bg-background">
          {chartData.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data available for the selected time range</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Legend */}
        {chartData.length > 0 && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metrics[selectedMetric].color }}
              />
              <span>{metrics[selectedMetric].label}</span>
            </div>
            <span>•</span>
            <span>{chartData.length} data points</span>
            <span>•</span>
            <span>{selectedTimeRange} time range</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart; 