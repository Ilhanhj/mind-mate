'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, BrainCircuit, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/context/language-context';


const onboardingSlidesContent = {
  en: [
    {
      question: 'What occupies your mind the most?',
      Icon: Wind,
      answers: ['My own thoughts', 'Work or school', 'Relationships', 'The future'],
    },
    {
      question: 'What do you seek to understand?',
      Icon: BrainCircuit,
      answers: ['My emotions', 'My purpose', 'My relationships', 'My habits'],
    },
    {
      question: 'What kind of growth are you hoping for?',
      Icon: Sparkles,
      answers: ['Inner peace', 'More confidence', 'Better focus', 'Kindness to self'],
    },
  ],
  id: [
    {
      question: 'Apa yang paling menyita pikiranmu?',
      Icon: Wind,
      answers: ['Pikiranku sendiri', 'Pekerjaan atau sekolah', 'Hubungan', 'Masa depan'],
    },
    {
      question: 'Apa yang ingin kamu pahami?',
      Icon: BrainCircuit,
      answers: ['Emosiku', 'Tujuanku', 'Hubunganku', 'Kebiasaanku'],
    },
    {
      question: 'Pertumbuhan seperti apa yang kamu harapkan?',
      Icon: Sparkles,
      answers: ['Ketenangan batin', 'Lebih percaya diri', 'Fokus lebih baik', 'Berbaik hati pada diri sendiri'],
    },
  ],
};


const BackgroundGradients = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className={cn('absolute w-[50vmax] h-[50vmax] rounded-full-blur-3xl top-[-10%] left-[-10%] bg-purple-500/50', 'animate-[spin_20s_linear_infinite_reverse]')} />
      <div className={cn('absolute w-[40vmax] h-[40vmax] rounded-full-blur-3xl bottom-[-10%] right-[-10%] bg-blue-500/50', 'animate-[spin_20s_linear_infinite]')} />
      <div className={cn('absolute w-[30vmax] h-[30vmax] rounded-full-blur-3xl bottom-[10%] left-[5%] bg-pink-500/40', 'animate-[spin_25s_linear_infinite]')} />
    </div>
    <style jsx>{`
      .rounded-full-blur-3xl {
        border-radius: 9999px;
        filter: blur(120px);
      }
    `}</style>
  </>
);


export default function OnboardingPage() {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState<'language' | 'questions'>('language');
  const { language, setLanguage, dictionary } = useLanguage();

  const slides = onboardingSlidesContent[language];
  const totalSlides = slides.length;

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
  const handleLanguageSelect = (lang: 'en' | 'id') => {
    setLanguage(lang);
    setStep('questions');
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/home');
  };
  
  const handleAnswerSelect = () => {
    if (current === totalSlides - 1) {
        handleFinishOnboarding();
    } else {
        api?.scrollNext();
    }
  };


  const containerVariants = {
      hidden: {},
      visible: {
          transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
          }
      }
  }
  
  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }


  return (
    <div className="flex h-full flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <BackgroundGradients />
      
      <AnimatePresence mode="wait">
        {step === 'language' ? (
          <motion.div
            key="language-select"
            className="text-center flex flex-col items-center h-full justify-center z-10 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
             <motion.div
                variants={itemVariants}
                animate={{
                    y: [0, -10, 0],
                    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <div className="w-32 h-32 rounded-full mb-8 shadow-2xl shadow-primary/10 flex items-center justify-center bg-background/20">
                    <Globe className="w-12 h-12 text-pink-300" />
                </div>
            </motion.div>
            <motion.h3
                variants={itemVariants}
                className="font-headline text-4xl font-bold text-foreground max-w-sm mx-auto leading-tight"
            >
              Choose your language
            </motion.h3>
             <motion.p variants={itemVariants} className="text-muted-foreground mt-2">to begin your reflection journey.</motion.p>
            <motion.div variants={containerVariants} className="mt-12 w-full max-w-xs space-y-4">
              <motion.div
                  key="en"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
              >
                  <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 text-base font-medium rounded-full bg-background/10 backdrop-blur-sm border-white/10 hover:bg-white/20 hover:text-foreground"
                      onClick={() => handleLanguageSelect('en')}
                  >
                      English
                  </Button>
              </motion.div>
              <motion.div
                  key="id"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
              >
                  <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 text-base font-medium rounded-full bg-background/10 backdrop-blur-sm border-white/10 hover:bg-white/20 hover:text-foreground"
                      onClick={() => handleLanguageSelect('id')}
                  >
                      Bahasa Indonesia
                  </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            className="flex h-full w-full flex-col items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="w-full flex justify-between items-center pt-4 z-10">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500 ease-in-out',
                      i === current ? 'w-8 bg-primary' : 'w-2 bg-primary/40'
                    )}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={handleFinishOnboarding}
                className="text-muted-foreground hover:text-foreground"
              >
                {dictionary.onboarding.skip}
              </Button>
            </div>

            <div className="w-full pt-8 z-10 flex-grow">
              <Carousel setApi={setApi} className="w-full h-full" opts={{watchDrag: false}}>
                <CarouselContent className="h-full">
                  {slides.map((slide, index) => {
                    return (
                      <CarouselItem key={index} className="h-full">
                        <AnimatePresence mode="wait">
                          {current === index && (
                            <motion.div
                              className="text-center flex flex-col items-center h-full justify-center"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <motion.div
                                  variants={itemVariants}
                                  animate={{
                                      y: [0, -10, 0],
                                      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                  }}
                                >
                                  <div className="w-32 h-32 rounded-full mb-8 shadow-2xl shadow-primary/10 flex items-center justify-center bg-background/20">
                                      <slide.Icon className="w-12 h-12 text-pink-300" />
                                  </div>
                              </motion.div>

                              <motion.h3
                                variants={itemVariants}
                                className="font-headline text-4xl font-bold text-foreground max-w-sm mx-auto leading-tight"
                              >
                                {slide.question}
                              </motion.h3>
                              <motion.div variants={containerVariants} className="mt-12 w-full max-w-xs space-y-3">
                                  {slide.answers.map((answer, ansIndex) => (
                                      <motion.div
                                          key={ansIndex}
                                          variants={itemVariants}
                                          whileHover={{ y: -3 }}
                                          whileTap={{ scale: 0.95 }}
                                      >
                                          <Button
                                              variant="outline"
                                              size="lg"
                                              className="w-full h-14 text-base font-medium rounded-full bg-background/10 backdrop-blur-sm border-white/10 hover:bg-white/20 hover:text-foreground"
                                              onClick={handleAnswerSelect}
                                          >
                                              {answer}
                                          </Button>
                                      </motion.div>
                                  ))}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
