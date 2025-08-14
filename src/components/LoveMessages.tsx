import { useState, useEffect } from 'react';
import { Quote, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoveMessage {
  month: string;
  message: string;
  author?: string;
}

// Sample love messages - you'll replace these with your Firebase data
const loveMessages: LoveMessage[] = [
  {
    month: "2024-01",
    message: "In your eyes, I found my home. In your heart, I found my love. In your soul, I found my mate.",
    author: "You"
  },
  {
    month: "2024-02",
    message: "Every love story is beautiful, but ours is my favorite. Thank you for being my forever person.",
    author: "Me"
  },
  {
    month: "2024-03",
    message: "You are my today and all of my tomorrows. I love you more than words can express.",
    author: "You"
  },
  {
    month: "2024-04",
    message: "With you, I've learned that love isn't just a feeling—it's a choice we make every day to care for each other.",
    author: "Me"
  },
  {
    month: "2024-05",
    message: "You make ordinary moments extraordinary just by being in them. I'm so grateful for every day with you.",
    author: "You"
  },
  {
    month: "2024-06",
    message: "Thank you for loving me exactly as I am, while inspiring me to become who I'm meant to be.",
    author: "Me"
  },
  {
    month: "2024-07",
    message: "In a world full of uncertainty, you are my constant. My anchor. My peace.",
    author: "You"
  },
  {
    month: "2024-08",
    message: "Every day I fall in love with you all over again. You are my greatest adventure and my safest place.",
    author: "Me"
  },
  {
    month: "2024-09",
    message: "You don't just complete me—you inspire me, challenge me, and make me want to be the best version of myself.",
    author: "You"
  },
  {
    month: "2024-10",
    message: "Our love story is my favorite story to tell, and I can't wait to write more chapters together.",
    author: "Me"
  },
  {
    month: "2024-11",
    message: "With you, I've learned that home isn't a place—it's a person. You are my home.",
    author: "You"
  },
  {
    month: "2024-12",
    message: "As this year ends, I'm filled with gratitude for every moment we've shared and excitement for all that's to come.",
    author: "Me"
  }
];

export const LoveMessages = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMessage, setSelectedMessage] = useState<LoveMessage | null>(null);

  useEffect(() => {
    // Get current month's message
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const currentMessage = loveMessages.find(msg => msg.month === currentMonth);
    setSelectedMessage(currentMessage || loveMessages[0]);
  }, [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Month's Message */}
      <Card className="bg-gradient-to-br from-accent/30 to-primary/20 backdrop-blur-sm border-border/50 love-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Quote className="w-6 h-6 text-primary romantic-float" />
            Love Message for {formatMonthYear(currentDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMessage && (
            <div className="space-y-4">
              <blockquote className="text-lg leading-relaxed text-foreground font-medium italic">
                "{selectedMessage.message}"
              </blockquote>
              {selectedMessage.author && (
                <div className="text-right text-muted-foreground">
                  — With love, {selectedMessage.author}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigateMonth('prev')}
          className="flex items-center gap-2 hover:bg-secondary/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Month
        </Button>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Browse Messages</span>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigateMonth('next')}
          className="flex items-center gap-2 hover:bg-secondary/50 transition-all duration-300"
        >
          Next Month
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Message Archive */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Message Archive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {loveMessages.slice().reverse().map((message, index) => {
              const messageDate = new Date(message.month + '-01');
              const isSelected = message.month === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
              
              return (
                <Card
                  key={message.month}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary bg-primary/10' : 'bg-card hover:bg-secondary/30'
                  }`}
                  onClick={() => setCurrentDate(messageDate)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">
                        {messageDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      {message.author && (
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {message.author}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};