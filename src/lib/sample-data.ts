import { subDays, formatISO } from 'date-fns';
import type { MoodLog, JournalEntry, Meditation, Tip } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

const today = new Date();

export const sampleMoodLogs: MoodLog[] = [
  { id: '1', date: formatISO(subDays(today, 1)), mood: 'happy', intensity: 4, note: 'Had a great day with friends.' },
  { id: '2', date: formatISO(subDays(today, 1)), mood: 'neutral', intensity: 3 },
  { id: '3', date: formatISO(subDays(today, 2)), mood: 'anxious', intensity: 3, note: 'Worried about upcoming deadline.' },
  { id: '4', date: formatISO(subDays(today, 3)), mood: 'happy', intensity: 5, note: 'Finally finished my project!' },
  { id: '5', date: formatISO(subDays(today, 4)), mood: 'happy', intensity: 5, note: 'Finally finished my project!' },
  { id: '6', date: formatISO(subDays(today, 5)), mood: 'anxious', intensity: 4, note: 'Big presentation tomorrow.' },
  { id: '7', date: formatISO(subDays(today, 6)), mood: 'neutral', intensity: 3 },
  { id: '8', date: formatISO(subDays(today, 0)), mood: 'happy', intensity: 4, note: 'Morning walk was refreshing.'},
  { id: '9', date: formatISO(subDays(today, 2)), mood: 'anxious', intensity: 3, note: 'Thinking about the future.' },
  { id: '10', date: formatISO(subDays(today, 5)), mood: 'tired', intensity: 4, note: 'Did not sleep well.'},
  { id: '11', date: formatISO(subDays(today, 8)), mood: 'happy', intensity: 4, note: 'Weekend vibes!' },
  { id: '12', date: formatISO(subDays(today, 9)), mood: 'neutral', intensity: 3, note: 'A quiet day at home.' },
  { id: '13', date: formatISO(subDays(today, 10)), mood: 'tired', intensity: 2, note: 'Feeling a bit under the weather.' },
  { id: '14', date: formatISO(subDays(today, 11)), mood: 'anxious', intensity: 4, note: 'Stressed about work.' },
  { id: '15', date: formatISO(subDays(today, 12)), mood: 'happy', intensity: 5, note: 'Celebrated a small win today.' },
  { id: '16', date: formatISO(subDays(today, 13)), mood: 'sad', intensity: 3, note: 'Missing my family.' },
  { id: '17', date: formatISO(subDays(today, 14)), mood: 'neutral', intensity: 3 },
  { id: '18', date: formatISO(subDays(today, 15)), mood: 'happy', intensity: 4, note: 'Productive day.' },
  { id: '19', date: formatISO(subDays(today, 16)), mood: 'angry', intensity: 4, note: 'Frustrated with traffic.' },
  { id: '20', date: formatISO(subDays(today, 17)), mood: 'anxious', intensity: 3 },
  { id: '21', date: formatISO(subDays(today, 18)), mood: 'happy', intensity: 5, note: 'Date night was amazing.' },
  { id: '22', date: formatISO(subDays(today, 19)), mood: 'tired', intensity: 4 },
  { id: '23', date: formatISO(subDays(today, 20)), mood: 'neutral', intensity: 2 },
  { id: '24', date: formatISO(subDays(today, 21)), mood: 'happy', intensity: 4, note: 'Enjoyed a nice dinner.' },
  { id: '25', date: formatISO(subDays(today, 22)), mood: 'sad', intensity: 3, note: 'Feeling lonely.' },
  { id: '26', date: formatISO(subDays(today, 23)), mood: 'anxious', intensity: 4, note: 'Too much on my plate.' },
  { id: '27', date: formatISO(subDays(today, 24)), mood: 'happy', intensity: 3 },
  { id: '28', date: formatISO(subDays(today, 25)), mood: 'neutral', intensity: 3, note: 'Just a regular day.' },
  { id: '29', date: formatISO(subDays(today, 26)), mood: 'tired', intensity: 5, note: 'Exhausted.' },
  { id: '30', date: formatISO(subDays(today, 27)), mood: 'happy', intensity: 4, note: 'Hiking in the mountains.' },
  { id: '31', date: formatISO(subDays(today, 28)), mood: 'anxious', intensity: 2 },
  { id: '32', date: formatISO(subDays(today, 29)), mood: 'happy', intensity: 5, note: 'Reached a personal goal.' },
  { id: '33', date: formatISO(subDays(today, 30)), mood: 'neutral', intensity: 3, note: 'Feeling balanced.' },
  { id: '34', date: formatISO(subDays(today, 0)), mood: 'neutral', intensity: 3, note: 'Chill day' },
  { id: '35', date: formatISO(subDays(today, 1)), mood: 'sad', intensity: 2, note: 'A bit down' },
  { id: '36', date: formatISO(subDays(today, 2)), mood: 'happy', intensity: 4, note: 'Good news!' },
  { id: '37', date: formatISO(subDays(today, 3)), mood: 'tired', intensity: 3, note: 'Long day' },
  { id: '38', date: formatISO(subDays(today, 4)), mood: 'anxious', intensity: 2, note: 'Slightly worried' },
  { id: '39', date: formatISO(subDays(today, 5)), mood: 'neutral', intensity: 3, note: 'Just another day' },
  { id: '40', date: formatISO(subDays(today, 6)), mood: 'happy', intensity: 4, note: 'Ready for the week' },
];

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: formatISO(subDays(today, 1)),
    prompt: "What made you feel a burst of joy today?",
    content: "Seeing my friend after a long time was wonderful. We laughed so much, and it reminded me of how important good company is."
  },
  {
    id: 'j2',
    date: formatISO(subDays(today, 4)),
    prompt: "Write about a small win you had this week.",
    content: "I finally managed to finish a project I've been procrastinating on for weeks. It feels like a huge weight has been lifted off my shoulders. I'm proud of myself for pushing through."
  },
   {
    id: 'j3',
    date: formatISO(subDays(today, 7)),
    prompt: "Describe a moment of unexpected kindness.",
    content: "A stranger held the door open for me when my hands were full. It was a small gesture, but it made my day."
  },
  {
    id: 'j4',
    date: formatISO(subDays(today, 10)),
    prompt: "What are you most proud of today?",
    content: "I cooked a new recipe from scratch and it turned out delicious! It's nice to know I can create something great with a little effort."
  },
  {
    id: 'j5',
    date: formatISO(subDays(today, 15)),
    prompt: "What's a small step you can take towards a big dream?",
    content: "I spent an hour learning a new skill online that will help with my career goals. It feels good to be making progress, even if it's just a little bit at a time."
  },
  {
    id: 'j6',
    date: formatISO(subDays(today, 20)),
    prompt: "What made you feel a burst of joy today?",
    content: "I went for a long walk in the park and listened to my favorite podcast. The weather was perfect and it was so relaxing."
  },
  {
    id: 'j7',
    date: formatISO(subDays(today, 25)),
    prompt: "Write about a small win you had this week.",
    content: "I woke up early every day this week and it's made a huge difference in my productivity and mood. I feel like I have so much more time now."
  },
];

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    imageUrl: image?.imageUrl || '',
    imageHint: image?.imageHint || '',
  };
};


export const sampleMeditations: Meditation[] = [
    {
        id: 'm1',
        title: 'Morning Mindfulness',
        description: 'Start your day with calm and focus.',
        duration: 10,
        ...findImage('meditation-morning')
    },
    {
        id: 'm2',
        title: 'Deep Sleep Relaxation',
        description: 'A guided meditation for restful sleep.',
        duration: 15,
        ...findImage('meditation-sleep')
    },
    {
        id: 'm3',
        title: 'Quick Stress Reset',
        description: 'Find calm in just a few minutes.',
        duration: 5,
        ...findImage('meditation-stress')
    }
];

export const sampleTips: Tip[] = [
    {
        id: 't1',
        category: 'breathing',
        text: 'Feeling anxious? Try box breathing: inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.',
    },
    {
        id: 't2',
        category: 'reflection',
        text: 'Take a moment to write down one thing you are grateful for today.',
    },
    {
        id: 't3',
        category: 'mindfulness',
        text: 'Pay attention to the sounds around you for 60 seconds. What do you notice?',
    },
    {
        id: 't4',
        category: 'self-care',
        text: 'Stretch your body for 5 minutes. Notice how your muscles feel.',
    },
    {
        id: 't5',
        category: 'gratitude',
        text: 'Think of a person who has helped you recently and send them a thank you message.',
    },
];
