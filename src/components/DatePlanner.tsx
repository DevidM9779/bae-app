import { useState } from 'react';
import { Calendar, MapPin, Clock, Package, Plus, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DatePlan {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
  time: string;
  whatToBring: string[];
  isUpcoming: boolean;
  category: 'romantic' | 'adventure' | 'cozy' | 'special';
}

// Sample date plans - you'll replace these with your Firebase data
const samplePlans: DatePlan[] = [
  {
    id: '1',
    title: 'Sunset Picnic in the Park',
    location: 'Central Park',
    description: 'A romantic evening watching the sunset together with homemade treats and good music.',
    date: '2024-01-20',
    time: '17:00',
    whatToBring: ['Picnic blanket', 'Homemade sandwiches', 'Wine', 'Bluetooth speaker'],
    isUpcoming: true,
    category: 'romantic'
  },
  {
    id: '2',
    title: 'Cooking Class Together',
    location: 'Italian Cooking Studio',
    description: 'Learn to make fresh pasta and tiramisu together in a fun, interactive class.',
    date: '2024-01-25',
    time: '19:00',
    whatToBring: ['Aprons', 'Camera for photos', 'Appetite for fun'],
    isUpcoming: true,
    category: 'adventure'
  },
  {
    id: '3',
    title: 'Movie Marathon Night',
    location: 'Our Living Room',
    description: 'Cozy night in with our favorite romantic movies, popcorn, and cuddles.',
    date: '2024-01-15',
    time: '20:00',
    whatToBring: ['Comfy clothes', 'Favorite snacks', 'Soft blankets'],
    isUpcoming: false,
    category: 'cozy'
  },
  {
    id: '4',
    title: 'Surprise Date Night',
    location: '🤫 Secret Location',
    description: 'A special surprise I\'ve been planning... you\'ll find out soon!',
    date: '2024-02-14',
    time: '18:30',
    whatToBring: ['Dress nicely', 'Open mind', 'Beautiful smile'],
    isUpcoming: true,
    category: 'special'
  }
];

const categoryColors = {
  romantic: 'bg-red-100 text-red-800 border-red-200',
  adventure: 'bg-blue-100 text-blue-800 border-blue-200',
  cozy: 'bg-green-100 text-green-800 border-green-200',
  special: 'bg-purple-100 text-purple-800 border-purple-200'
};

const categoryIcons = {
  romantic: '💕',
  adventure: '🗺️',
  cozy: '🏠',
  special: '✨'
};

export const DatePlanner = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  const filteredPlans = samplePlans.filter(plan => {
    if (filter === 'upcoming') return plan.isUpcoming;
    if (filter === 'past') return !plan.isUpcoming;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Our Date Plans</h2>
          <p className="text-muted-foreground">Quality time together, planned with love</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Plans
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="sm"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
            size="sm"
          >
            Past
          </Button>
        </div>
      </div>

      {/* Add new plan button */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Plan Our Next Adventure</span>
          </div>
        </CardContent>
      </Card>

      {/* Date plans grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPlans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 love-glow"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{categoryIcons[plan.category]}</span>
                  {plan.title}
                </CardTitle>
                <Badge className={categoryColors[plan.category]}>
                  {plan.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{plan.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDate(plan.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{plan.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{plan.location}</span>
                </div>
              </div>

              {plan.whatToBring.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>What to bring:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.whatToBring.map((item, itemIndex) => (
                      <Badge 
                        key={itemIndex} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">
                    {plan.isUpcoming ? 'Looking forward to this!' : 'Beautiful memory'}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  {plan.isUpcoming ? 'View Details' : 'Relive Memory'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 gentle-pulse" />
          <p className="text-muted-foreground">
            {filter === 'upcoming' 
              ? "No upcoming plans yet. Time to plan something special!" 
              : filter === 'past'
              ? "No past dates recorded yet."
              : "No date plans yet. Let's start planning!"}
          </p>
        </div>
      )}
    </div>
  );
};