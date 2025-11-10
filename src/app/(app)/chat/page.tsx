
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Sparkles, Loader2, User, Bot, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { getChatResponseAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

const nicknames = ['Starlight', 'River', 'Willow', 'Sky', 'Echo', 'Phoenix'];

export default function ChatPage() {
    const { dictionary } = useLanguage();
    const initialMessages: ChatMessage[] = [
        {
            id: '1',
            sender: 'bot',
            text: dictionary.chat.welcome,
        },
    ];

    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNickname(nicknames[Math.floor(Math.random() * nicknames.length)]);
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const chatHistory = [...messages, userMessage].map(m => `${m.sender}: ${m.text}`).join('\n');
        
        try {
            const result = await getChatResponseAction({ userMessage: input, chatHistory });
            if (result.success && result.data) {
                const botMessage: ChatMessage = {
                    id: Date.now().toString() + 'b',
                    sender: 'bot',
                    text: result.data.response,
                };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                throw new Error(result.error || dictionary.chat.error);
            }
        } catch (error) {
             toast({
                title: dictionary.chat.errorTitle,
                description: error instanceof Error ? error.message : `${dictionary.chat.error} ${dictionary.chat.tryAgain}`,
                variant: 'destructive',
            });
            // Revert optimistic update
            setMessages(prev => prev.filter(m => m.id !== userMessage.id));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <div className="text-center pt-4">
                <h1 className="font-headline text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                    <MessageCircle className="w-7 h-7" />
                    {dictionary.chat.title}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm max-w-xs mx-auto">
                    {dictionary.chat.description}
                </p>
            </div>

            <Card className="flex-grow rounded-3xl shadow-lg flex flex-col bg-card/80">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div ref={scrollAreaRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, type: 'spring' }}
                                    className={cn(
                                        'flex items-end gap-2',
                                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.sender === 'bot' && (
                                        <Avatar className="h-8 w-8 bg-primary/20 border border-primary/30">
                                            <AvatarFallback>
                                                <Bot className="h-5 w-5 text-primary" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            'max-w-[75%] p-3 rounded-2xl shadow',
                                            message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-background/80 text-foreground rounded-bl-none'
                                        )}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                    {message.sender === 'user' && (
                                        <Avatar className="h-8 w-8 bg-secondary/20 border-2 border-secondary/50">
                                            <AvatarFallback className="text-sm font-bold text-secondary-foreground">
                                                {nickname.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    key="loading"
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-end gap-2 justify-start"
                                >
                                    <Avatar className="h-8 w-8 bg-primary/20 border-2 border-primary/50">
                                        <AvatarFallback>
                                            <Bot className="h-5 w-5 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-[75%] p-3 rounded-2xl bg-muted rounded-bl-none shadow-md">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 border-t bg-background/50 backdrop-blur-sm rounded-b-3xl">
                        <div className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                placeholder={`${dictionary.chat.placeholder}, ${nickname}...`}
                                className="h-12 rounded-full pl-5 pr-14 bg-muted focus-visible:ring-2 focus-visible:ring-primary/80"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full gradient-button"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
