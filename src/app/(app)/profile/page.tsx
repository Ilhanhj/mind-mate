
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  ChevronRight,
  Moon,
  Shield,
  LogOut,
  Loader2,
  Sparkles,
  Trophy,
  BookCheck,
  Wind,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  format,
  parseISO,
  subDays,
  startOfDay,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from 'date-fns';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import type { Mood, MoodLog } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleMoodLogs, sampleJournalEntries } from '@/lib/sample-data';
import { getPersonalizedInsightsAction } from './actions';
import { useLanguage } from '@/context/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const moodEmojis: Record<string, string> = {
  happy: '😄',
  sad: '😢',
  anxious: '😟',
  tired: '😴',
  angry: '😠',
  neutral: '😐',
};

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#00C49F',
  '#FFBB28',
];

export default function ProfilePage() {
  const { dictionary, language, setLanguage } = useLanguage();
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedLogs = localStorage.getItem('moodLogs');
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs);
      if (parsedLogs.length > 0) {
        setMoodLogs(parsedLogs);
        return;
      }
    }
    setMoodLogs(sampleMoodLogs);
  }, []);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights('');

    const journalEntriesStr = localStorage.getItem('journalEntries');
    const journalEntries = journalEntriesStr
      ? JSON.parse(journalEntriesStr)
      : sampleJournalEntries;

    if (moodLogs.length < 3 && journalEntries.length < 3) {
      toast({
        title: dictionary.profile.toastNotEnoughDataTitle,
        description: dictionary.profile.toastNotEnoughDataDescription,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const input = {
      journalEntries: journalEntries.map((e: { content: string }) => e.content),
      moodData: moodLogs.map((log) => ({
        mood: log.mood,
        intensity: log.intensity,
        date: log.date,
      })),
    };

    const result = await getPersonalizedInsightsAction(input);

    if (result.success && result.data) {
      setInsights(result.data.insights);
    } else {
      toast({
        title: dictionary.profile.toastErrorGeneratingInsightsTitle,
        description: result.error || dictionary.profile.toastErrorGeneratingInsightsDescription,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const getDailyMoodData = () => {
    const today = startOfDay(new Date());
    return moodLogs
      .filter(
        (log) =>
          format(parseISO(log.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      )
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  };

  const getWeeklyMoodData = () => {
    const today = startOfDay(new Date());
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(today, i)
    ).reverse();

    return last7Days.map((date) => {
      const dayLogs = moodLogs.filter(
        (log) =>
          format(parseISO(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const avgIntensity =
        dayLogs.length > 0
          ? dayLogs.reduce((sum, log) => sum + log.intensity, 0) /
            dayLogs.length
          : 0;
      return {
        name: format(date, 'EEE'),
        intensity: Math.round(avgIntensity * 10) / 10,
      };
    });
  };

  const getMonthlyMoodData = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map((date) => {
      const dayLogs = moodLogs.filter(
        (log) =>
          format(parseISO(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const avgIntensity =
        dayLogs.length > 0
          ? dayLogs.reduce((sum, log) => sum + log.intensity, 0) /
            dayLogs.length
          : 0;
      return {
        name: format(date, 'd'),
        intensity: Math.round(avgIntensity * 10) / 10,
      };
    });
  };
  
  const translatedMood = (mood: Mood) => {
    return dictionary.moods[mood] || mood;
  }

  const getFrequentMoods = () => {
    if (moodLogs.length === 0) return [];
    const moodCounts = moodLogs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(moodCounts)
      .map(([name, value]) => ({ name: name as Mood, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getMoodDistribution = () => {
    if (moodLogs.length === 0) return [];
    const moodCounts = moodLogs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto pb-20">
      <div className="flex flex-col items-center space-y-2 pt-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
            <AvatarImage
              src="https://picsum.photos/seed/mindmate-user/200"
              data-ai-hint="person smiling"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </motion.div>
        <h1 className="font-headline text-2xl font-bold text-foreground pt-2">
          Alex Doe
        </h1>
        <p className="text-muted-foreground text-sm">{dictionary.profile.joined}</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold text-foreground pt-4 px-2 text-center">
          {dictionary.profile.myInsights}
        </h2>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">{dictionary.profile.daily}</TabsTrigger>
            <TabsTrigger value="weekly">{dictionary.profile.weekly}</TabsTrigger>
            <TabsTrigger value="monthly">{dictionary.profile.monthly}</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="pt-2">
            <motion.div initial="hidden" animate="visible" className="space-y-4">
              <motion.div variants={cardVariants} custom={0}>
                <Card className="rounded-3xl shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{dictionary.profile.dailyLog}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    {getDailyMoodData().length > 0 ? (
                      getDailyMoodData().map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between bg-muted p-3 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">
                              {moodEmojis[log.mood]}
                            </span>
                            <div>
                              <p className="font-semibold capitalize">
                                {translatedMood(log.mood)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(parseISO(log.date), 'p')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {dictionary.profile.intensity}: {log.intensity}
                            </p>
                            {log.note && (
                              <p className="text-sm text-muted-foreground italic truncate max-w-[100px]">
                                "{log.note}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        {dictionary.profile.noMoodsLogged}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="weekly" className="pt-2">
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={cardVariants}
                custom={0}
                className="w-full"
              >
                <Card className="rounded-3xl shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">
                      {dictionary.profile.weeklyTrend}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {moodLogs.length > 0 ? (
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart
                          data={getWeeklyMoodData()}
                          margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                          }}
                        >
                          <XAxis
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis
                            domain={[0, 5]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <Tooltip
                            cursor={{
                              fill: 'hsl(var(--primary) / 0.1)',
                              radius: 8,
                            }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderRadius: 'var(--radius)',
                              border: '1px solid hsl(var(--border))',
                              color: 'hsl(var(--card-foreground))',
                            }}
                          />
                          <Bar
                            dataKey="intensity"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        {dictionary.profile.logMoodToSeeTrends}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  variants={cardVariants}
                  custom={1}
                  className="w-full"
                >
                  <Card className="rounded-3xl shadow-lg h-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{dictionary.profile.topMoods}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
                      {getFrequentMoods().length > 0 ? (
                        getFrequentMoods()
                          .slice(0, 3)
                          .map((mood) => (
                            <Badge
                              key={mood.name}
                              variant="secondary"
                              className="text-sm capitalize py-1 px-2.5 rounded-full font-medium border-none"
                            >
                              <span className="mr-1.5 text-base">
                                {moodEmojis[mood.name]}
                              </span>
                              {translatedMood(mood.name)}
                            </Badge>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {dictionary.profile.noMoodsLoggedYet}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  custom={2}
                  className="w-full"
                >
                  <Card className="rounded-3xl shadow-lg h-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{dictionary.profile.weeklyBalance}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 h-[100px]">
                      {getMoodDistribution().length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getMoodDistribution()}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              stroke="hsl(var(--background))"
                            >
                              {getMoodDistribution().map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [value, translatedMood(name as Mood)]}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center pt-4">
                          {dictionary.profile.noData}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                variants={cardVariants}
                custom={3}
                className="w-full"
              >
                <Card className="rounded-3xl shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{dictionary.profile.achievements}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-4 p-4 pt-0 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dictionary.profile.achievement7Day}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dictionary.profile.achievementFirstInsight}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <Wind className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dictionary.profile.achievementMindfulMinute}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-purple-400/20 flex items-center justify-center">
                        <BookCheck className="w-6 h-6 text-purple-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dictionary.profile.achievementJournalPro}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          <TabsContent value="monthly" className="pt-2">
            <motion.div initial="hidden" animate="visible" className="space-y-4">
              <motion.div variants={cardVariants} custom={0}>
                <Card className="rounded-3xl shadow-lg">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">
                      {dictionary.profile.monthlyTrend}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {moodLogs.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                          data={getMonthlyMoodData()}
                          margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                          }}
                        >
                          <XAxis
                            dataKey="name"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis
                            domain={[0, 5]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <Tooltip
                            cursor={{
                              fill: 'hsl(var(--primary) / 0.1)',
                              radius: 8,
                            }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderRadius: 'var(--radius)',
                              border: '1px solid hsl(var(--border))',
                              color: 'hsl(var(--card-foreground))',
                            }}
                          />
                          <Bar
                            dataKey="intensity"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        {dictionary.profile.logMoodToSeeTrends}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <Card className="rounded-3xl shadow-lg border-none bg-gradient-to-br from-primary/80 to-secondary/80">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg text-primary-foreground">
              {dictionary.profile.aiInsightsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
              </div>
            ) : insights ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary-foreground/90 whitespace-pre-wrap leading-relaxed text-sm"
              >
                {insights}
              </motion.p>
            ) : (
              <>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  {dictionary.profile.aiInsightsDescription}
                </p>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleGenerateInsights}
                    variant="secondary"
                    className="w-full bg-background/20 hover:bg-background/30 text-secondary-foreground rounded-full h-12 text-base"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {dictionary.profile.generateInsightsButton}
                  </Button>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl shadow-lg">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg">{dictionary.profile.settings}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span>{dictionary.profile.language}</span>
                </div>
                <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'id')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="mx-4 w-auto" />
            <Button
              variant="ghost"
              className="w-full justify-between h-14 text-base px-4"
            >
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>{dictionary.profile.notifications}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Separator className="mx-4 w-auto" />
            <Button
              variant="ghost"
              className="w-full justify-between h-14 text-base px-4"
            >
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span>{dictionary.profile.appearance}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Separator className="mx-4 w-auto" />
            <Button
              variant="ghost"
              className="w-full justify-between h-14 text-base px-4"
            >
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>{dictionary.profile.privacy}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="w-full h-12 rounded-full text-base font-semibold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {dictionary.profile.logOut}
        </Button>
      </motion.div>
    </div>
  );
}
