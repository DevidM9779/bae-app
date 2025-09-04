import { useState, useEffect } from 'react';
import { Heart, Calendar, Gem, Home as HomeIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Milestone {
  name: string;
  date: Date;
  icon: React.ReactNode;
  color: string;
}

export const RelationshipCounters = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Example dates - you'll replace these with your actual dates
  const milestones: Milestone[] = [
    {
      name: "First Date",
      date: new Date('2023-01-06T00:00:00-06:00'), // Replace with your actual first date
      icon: <Heart className="w-5 h-5" />,
      color: "text-red-500"
    },
    {
      name: "Proposal Day",
      date: new Date('2025-05-16T00:00:00-06:00'), // Replace with your actual proposal date
      icon: <Gem className="w-5 h-5" />,
      color: "text-yellow-500"
    },
    {
      name: "Wedding Day",
      date: new Date('2026-03-15T00:00:00-06:00'), // Replace with your actual wedding date
      icon: <HomeIcon className="w-5 h-5" />,
      color: "text-purple-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeDifference = (date: Date) => {
    const diff = currentTime.getTime() - date.getTime();

    const years = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24 * (1461/4)));
    const months = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24 * (1461/48))) % 12;
    const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24) % (1461/48));
    const hours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((Math.abs(diff) % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
  };


  const getNextMonthiversary = () => {
    const firstDate = milestones[0].date;
    const current = new Date();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, firstDate.getDate());
    
    if (current.getDate() > firstDate.getDate()) {
      next.setMonth(next.getMonth() + 1);
    } else if (current.getDate() === firstDate.getDate()) {
      // Today is monthiversary!
      return { isToday: true, daysLeft: 0 };
    }
    
    const daysLeft = Math.ceil((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    return { isToday: false, daysLeft, nextDate: next };
  };

  const monthiversary = getNextMonthiversary();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {/* Milestone Counters */}
      {milestones.map((milestone, index) => {
        const timeDiff = calculateTimeDifference(milestone.date);
        
        return (
          <Card 
            key={milestone.name} 
            className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 love-glow"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className={milestone.color}>{milestone.icon}</span>
                {milestone.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {timeDiff.years} years {timeDiff.months} months {timeDiff.days} days
                </div>
                <div className="text-sm text-muted-foreground">
                  {timeDiff.hours}h {timeDiff.minutes}m {timeDiff.seconds}s
                </div>
                <div className="text-xs text-muted-foreground">
                  Since {milestone.date.toDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Monthiversary Countdown */}
      <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm border-border/50 love-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-red-500 animate-heart-beat" />
            Next Monthiversary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthiversary.isToday ? (
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-primary mb-2">
                🎉 Happy Monthiversary! 🎉
              </div>
              <div className="text-lg text-muted-foreground">
                Today marks another beautiful month together!
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {/* Circular Progress */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="hsl(var(--border))"
                    strokeWidth="8"
                    fill="none"
                    className="opacity-20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - ((30 - (monthiversary.daysLeft || 0)) / 30))}`}
                    className="transition-all duration-500 ease-out"
                    style={{
                      filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))'
                    }}
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-primary mb-1">
                    {monthiversary.daysLeft}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    days left
                  </span>
                </div>
              </div>
              
              {/* Date info */}
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground mb-1">
                  Next Celebration
                </div>
                <div className="text-sm text-muted-foreground">
                  {monthiversary.nextDate && monthiversary.nextDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};