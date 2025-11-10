'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Award, RefreshCw, Wind, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/language-context';

const breathingTechniques = {
  box: {
    name: 'Box Breathing',
    cycle: [
      { phase: 'Inhale', duration: 4 },
      { phase: 'Hold', duration: 4 },
      { phase: 'Exhale', duration: 4 },
      { phase: 'Hold', duration: 4 },
    ],
  },
  '4-7-8': {
    name: '4-7-8 Relaxing Breath',
    cycle: [
      { phase: 'Inhale', duration: 4 },
      { phase: 'Hold', duration: 7 },
      { phase: 'Exhale', duration: 8 },
    ],
  },
};

type Technique = keyof typeof breathingTechniques;

export default function BreathingPage() {
  const { dictionary } = useLanguage();
  const [sessionLength, setSessionLength] = useState(1);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [playMusic, setPlayMusic] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>('box');

  const breathingCycle = breathingTechniques[selectedTechnique].cycle;
  const totalCycleDuration = breathingCycle.reduce(
    (sum, p) => sum + p.duration,
    0
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        setPhaseTimer((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            const nextPhaseIndex =
              (currentPhaseIndex + 1) % breathingCycle.length;
            setCurrentPhaseIndex(nextPhaseIndex);
            return breathingCycle[nextPhaseIndex].duration;
          }
        });
      }, 1000);
    } else if (isSessionActive && timer === 0) {
      setIsSessionActive(false);
      setIsSessionFinished(true);
    }

    return () => clearInterval(interval);
  }, [isSessionActive, timer, currentPhaseIndex, breathingCycle]);

  const startSession = (minutes: number) => {
    setSessionLength(minutes);
    setTimer(minutes * 60);
    setIsSessionActive(true);
    setIsSessionFinished(false);
    setCurrentPhaseIndex(0);
    setPhaseTimer(breathingCycle[0].duration);
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setIsSessionFinished(false);
    setTimer(0);
    setCurrentPhaseIndex(0);
    setPhaseTimer(breathingCycle[0].duration);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  const currentPhase = breathingCycle[currentPhaseIndex];
  const translatedPhase = (phase: string) => {
    switch (phase) {
      case 'Inhale': return dictionary.breathing.inhale;
      case 'Hold': return dictionary.breathing.hold;
      case 'Exhale': return dictionary.breathing.exhale;
      default: return phase;
    }
  }


  return (
    <AnimatePresence mode="wait">
      {isSessionFinished ? (
        <motion.div
          key="finished"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="flex flex-col items-center justify-center h-full p-6"
        >
          <Card className="w-full max-w-sm text-center p-8 rounded-3xl shadow-xl bg-card">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { delay: 0.2, type: 'spring' },
              }}
            >
              <Award className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold font-headline text-foreground">
              {dictionary.breathing.finishedTitle}
            </h2>
            <p className="text-muted-foreground text-base mt-2">
              {dictionary.breathing.finishedDescription.replace('{minutes}', sessionLength.toString())}
            </p>
            <motion.div whileTap={{ scale: 0.95 }} className="mt-8">
              <Button
                onClick={resetSession}
                className="w-full gradient-button rounded-full h-12 text-base"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> {dictionary.breathing.startAnother}
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      ) : isSessionActive ? (
        <motion.div
          key="active"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="flex flex-col items-center justify-center h-full p-4"
        >
          <div className="relative flex items-center justify-center w-64 h-64">
            <motion.div
              className="absolute w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full filter blur-[80px] opacity-50"
              animate={{
                scale: currentPhase.phase === 'Inhale' ? 1.2 : 0.8,
                opacity:
                  currentPhase.phase === 'Inhale' ||
                  currentPhase.phase === 'Hold'
                    ? 0.7
                    : 0.4,
              }}
              transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
            ></motion.div>

            <motion.div
              className="absolute w-full h-full border-4 border-primary/10 rounded-full"
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: totalCycleDuration,
                repeat: Infinity,
                ease: 'linear',
              }}
            ></motion.div>

            <div className="z-10 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase.phase}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-semibold text-foreground/80 font-headline"
                >
                  {translatedPhase(currentPhase.phase)}
                </motion.p>
              </AnimatePresence>
              <p className="text-7xl font-bold text-foreground mt-1">{phaseTimer}</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-base text-muted-foreground">
              {dictionary.breathing.timeRemaining}
            </p>
            <p className="text-2xl font-semibold mt-1 text-foreground/90">
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </p>
          </div>
          <Button
            onClick={resetSession}
            variant="ghost"
            className="mt-6 text-base"
          >
            {dictionary.breathing.endSession}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="setup"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="p-4 pt-8 space-y-6 h-full flex flex-col items-center overflow-y-auto"
        >
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold text-foreground">
              {dictionary.breathing.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              {dictionary.breathing.description}
            </p>
          </div>

          <Card className="rounded-3xl shadow-lg w-full max-w-sm">
            <CardContent className="p-6 space-y-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Wind className="w-12 h-12 text-primary-foreground" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-xl font-semibold font-headline mb-4">
                  {dictionary.breathing.chooseTechnique}
                </h2>
                <div className="flex justify-center gap-2">
                  {(Object.keys(breathingTechniques) as Technique[]).map(
                    (tech) => (
                      <Button
                        key={tech}
                        onClick={() => setSelectedTechnique(tech)}
                        variant={selectedTechnique === tech ? 'default' : 'outline'}
                        className="rounded-full"
                      >
                        {breathingTechniques[tech].name}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold font-headline">
                  {dictionary.breathing.chooseLength}
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  {[1, 3, 5].map((min) => (
                    <motion.div key={min} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => startSession(min)}
                        variant="outline"
                        className="w-20 h-20 rounded-full flex flex-col text-lg border-2 border-border hover:bg-primary/10"
                      >
                        <span className="font-bold text-2xl">{min}</span>
                        <span className="text-sm">{dictionary.breathing.min}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <Switch
                  id="music-toggle"
                  checked={playMusic}
                  onCheckedChange={setPlayMusic}
                />
                <Label
                  htmlFor="music-toggle"
                  className="text-base text-muted-foreground"
                >
                  {dictionary.breathing.backgroundMusic}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg w-full max-w-sm">
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                <History className="w-5 h-5" /> {dictionary.breathing.sessionHistory}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">Box Breathing</p>
                    <p className="text-sm text-muted-foreground">
                      5 {dictionary.breathing.min} - {dictionary.breathing.yesterday}
                    </p>
                  </div>
                  <p className="font-bold text-primary">{dictionary.breathing.done}</p>
                </div>
                <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">4-7-8 Relaxing Breath</p>
                    <p className="text-sm text-muted-foreground">
                      3 {dictionary.breathing.min} - 2 {dictionary.breathing.daysAgo}
                    </p>
                  </div>
                  <p className="font-bold text-primary">{dictionary.breathing.done}</p>
                </div>
                <p className="text-sm text-muted-foreground text-center pt-2">
                  {dictionary.breathing.historySubtext}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
