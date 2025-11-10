'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Mood, MoodLog, Meditation } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked,
  Wind,
  Smile,
  PenSquare,
  ChevronRight,
  Play,
  Heart,
  Brain,
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import { sampleMoodLogs, sampleMeditations, sampleTips } from '@/lib/sample-data';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context';

const moodEmojis: Record<Mood, string> = {
  happy: '😄',
  sad: '😢',
  anxious: '😟',
  tired: '😴',
  angry: '😠',
  neutral: '😐',
};

const tipIcons: { [key: string]: React.ElementType } = {
  breathing: Wind,
  reflection: BookMarked,
  mindfulness: Brain,
  gratitude: Heart,
  'self-care': Coffee,
};

export default function HomePage() {
  const { dictionary } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState([3]);
  const [note, setNote] = useState('');
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const { toast } = useToast();
  const [summary, setSummary] = useState({ calmPercentage: 0, journalCount: 0 });

  useEffect(() => {
    // Moved localStorage access here to ensure it runs only on the client
    const storedLogs = localStorage.getItem('moodLogs');
    const logs = storedLogs ? JSON.parse(storedLogs) : sampleMoodLogs;
    const sortedLogs = logs.sort(
      (a: MoodLog, b: MoodLog) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setMoodLogs(sortedLogs);

    const calmPercentage = Math.round(
      (sortedLogs.filter((log: MoodLog) =>
        ['happy', 'neutral'].includes(log.mood)
      ).length /
        (sortedLogs.length || 1)) *
        100
    );

    const journalCount =
      (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('journalEntries') || '[]').length) || 2;
    setSummary({ calmPercentage, journalCount });
  }, []);

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        title: dictionary.home.toastSelectMoodTitle,
        description: dictionary.home.toastSelectMoodDescription,
        variant: 'destructive',
      });
      return;
    }

    const newLog: MoodLog = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      intensity: intensity[0],
      note,
    };

    const updatedLogs = [...moodLogs, newLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setMoodLogs(updatedLogs);
    localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));

    toast({
      title: dictionary.home.toastMoodSavedTitle,
      description: dictionary.home.toastMoodSavedDescription,
    });

    setSelectedMood(null);
    setIntensity([3]);
    setNote('');
  };

  const SummaryCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: React.ElementType;
    title: string;
    value: string;
    color: string;
  }) => (
    <Card
      className={`rounded-2xl p-4 flex items-center gap-3 bg-card`}
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-bold text-foreground text-lg">{value}</p>
      </div>
    </Card>
  );
  
  const translatedMood = (mood: Mood) => {
    return dictionary.moods[mood] || mood;
  }

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto relative pb-20">
      <div className="pt-4 px-2">
        <h1 className="font-headline text-3xl font-bold text-foreground">
          {dictionary.home.greeting}, Alex
        </h1>
        <p className="text-muted-foreground mt-1">{dictionary.home.subtitle}</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-headline text-xl font-bold text-foreground px-2">{dictionary.home.forYou}</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-2">
            {sampleTips.map((tip) => {
               const Icon = tipIcons[tip.category] || Brain;
              return (
                <Card key={tip.id} className="w-64 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary"/>
                      </div>
                      <h3 className="font-semibold text-sm capitalize text-foreground/90">{dictionary.tips[tip.category]}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-normal leading-snug">{dictionary.tipContent[tip.id]}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
      
      <div className="grid grid-cols-2 gap-4 px-2">
        <SummaryCard
          icon={Smile}
          title={dictionary.home.calmThisWeek}
          value={`${summary.calmPercentage}%`}
          color="bg-blue-500/80"
        />
        <SummaryCard
          icon={PenSquare}
          title={dictionary.home.journalsThisWeek}
          value={`${summary.journalCount}`}
          color="bg-purple-500/80"
        />
      </div>

      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle>{dictionary.home.moodCheckTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(moodEmojis) as Mood[]).map((mood) => (
                <motion.button
                  key={mood}
                  onClick={() => setSelectedMood(mood as Mood)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 aspect-square ${
                    selectedMood === mood
                      ? 'bg-primary/20 scale-105 ring-2 ring-primary/50'
                      : 'bg-muted hover:bg-accent'
                  }`}
                >
                  <span className="text-4xl">{moodEmojis[mood]}</span>
                  <span className="text-xs font-semibold capitalize mt-1 text-foreground/80">
                    {translatedMood(mood)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <label className="text-sm font-medium text-muted-foreground px-1">
                  {dictionary.home.intensityLabel}: {intensity[0]}
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">1</span>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={5}
                    step={1}
                    className="my-2"
                  />
                  <span className="text-xs text-muted-foreground">5</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-sm font-medium text-muted-foreground px-1">
              {dictionary.home.addNoteLabel}
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dictionary.home.notePlaceholder}
              className="mt-2 min-h-[60px] rounded-2xl bg-muted"
            />
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSave}
              className="w-full gradient-button rounded-full h-12 text-base font-semibold"
            >
              {dictionary.home.saveMoodButton}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="font-headline text-xl font-bold text-foreground">
            {dictionary.home.meditationSectionTitle}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary">
            {dictionary.home.seeAll} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {sampleMeditations.map((meditation: Meditation) => (
            <Card
              key={meditation.id}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-28 h-28 relative flex-shrink-0">
                  <Image
                    src={meditation.imageUrl}
                    alt={dictionary.meditations[meditation.id]?.title || meditation.title}
                    fill
                    objectFit="cover"
                    data-ai-hint={meditation.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-base font-bold">
                    {dictionary.meditations[meditation.id]?.title || meditation.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 text-muted-foreground/90">
                    {dictionary.meditations[meditation.id]?.description || meditation.description}
                  </CardDescription>
                  <CardDescription className="text-xs mt-2">
                    {meditation.duration} min
                  </CardDescription>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-2">
        <h2 className="font-headline text-xl font-bold text-foreground">
          {dictionary.home.explore}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <QuickAccessCard
            href="/journal"
            icon={BookMarked}
            title={dictionary.nav.journal}
            description={dictionary.home.journalDescription}
            colorClass="bg-gradient-to-br from-blue-500 to-cyan-400"
          />
          <QuickAccessCard
            href="/breathing"
            icon={Wind}
            title={dictionary.nav.breathe}
            description={dictionary.home.breatheDescription}
            colorClass="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>
      </div>
    </div>
  );
}

const QuickAccessCard = ({
  href,
  icon: Icon,
  title,
  description,
  colorClass,
}: {
  href:string;
  icon: React.ElementType;
  title: string;
  description: string;
  colorClass: string;
}) => (
  <Link href={href} passHref>
    <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
      <Card
        className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${colorClass}`}
      >
        <CardContent className="p-4 flex items-center gap-4 h-full">
          <div className="bg-white/20 p-2 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">
              {title}
            </CardTitle>
            <CardDescription className="text-white/80 text-xs">
              {description}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);
