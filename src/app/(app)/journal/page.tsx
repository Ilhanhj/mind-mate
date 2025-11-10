'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { JournalEntry } from '@/lib/types';
import { Mic, Save, RefreshCw, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { sampleJournalEntries } from '@/lib/sample-data';
import { useLanguage } from '@/context/language-context';

export default function JournalPage() {
  const { dictionary } = useLanguage();
  const prompts = dictionary.journal.prompts;
  
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();

  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(
        JSON.parse(storedEntries).sort(
          (a: JournalEntry, b: JournalEntry) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } else {
      setEntries(
        sampleJournalEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionary]);

  const changePrompt = () => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleSave = () => {
    if (content.trim().length < 10) {
      toast({
        title: dictionary.journal.toastWriteMoreTitle,
        description: dictionary.journal.toastWriteMoreDescription,
        variant: 'destructive',
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      prompt: currentPrompt,
      content,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    toast({
      title: dictionary.journal.toastReflectionSavedTitle,
      description: dictionary.journal.toastReflectionSavedDescription,
    });

    setContent('');
    changePrompt();
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col overflow-y-auto pb-20">
      <div className="flex-shrink-0 pt-4 px-2">
        <h1 className="font-headline text-2xl font-bold text-foreground text-center">
          {dictionary.journal.title}
        </h1>
        <Card className="rounded-2xl shadow-sm border-none bg-primary/10 p-3 mt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-primary text-sm font-medium">{currentPrompt}</p>
            <Button
              onClick={changePrompt}
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0 text-primary/80 hover:text-primary"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">{dictionary.journal.newPrompt}</span>
            </Button>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl shadow-lg flex-grow flex flex-col">
        <CardContent className="p-2 flex-grow flex flex-col">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={dictionary.journal.placeholder}
            className="flex-grow w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-base p-3 placeholder:text-muted-foreground"
          />
        </CardContent>
      </Card>

      <div className="flex-shrink-0 flex items-center gap-3 pb-2">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 shadow-md"
          >
            <Mic className="h-5 w-5 text-primary" />
            <span className="sr-only">{dictionary.journal.voiceJournaling}</span>
          </Button>
        </motion.div>
        <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSave}
            className="w-full gradient-button rounded-full h-12 text-base font-semibold"
          >
            <Save className="mr-2 h-5 w-5" /> {dictionary.journal.saveReflection}
          </Button>
        </motion.div>
      </div>

      <div className="space-y-4 flex-shrink-0">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-headline text-xl font-bold">{dictionary.journal.pastEntries}</h2>
          <div className="relative w-full max-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${dictionary.journal.search}...`}
              className="pl-9 h-9 rounded-full bg-muted"
            />
          </div>
        </div>
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="rounded-2xl shadow-sm"
            >
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground/90">
                  {entry.prompt}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(entry.date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
          {entries.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              {dictionary.journal.noEntries}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
