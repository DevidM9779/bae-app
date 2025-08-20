import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Package, Plus, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DatePlan, addDatePlan, getDatePlans } from '@/firebase/firestore';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [plans, setPlans] = useState<DatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    location: '',
    description: '',
    date: '',
    time: '',
    itemsToBring: [] as string[],
    category: 'romantic' as const
  });
  const [itemInput, setItemInput] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadPlans = async () => {
      try {
        const datePlans = await getDatePlans(user.uid);
        setPlans(datePlans);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load date plans",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [user, toast]);
  
  const filteredPlans = plans.filter(plan => {
    const planDate = new Date(plan.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'upcoming') return planDate >= today;
    if (filter === 'past') return planDate < today;
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

  const handleAddItem = () => {
    if (itemInput.trim() && !newPlan.itemsToBring.includes(itemInput.trim())) {
      setNewPlan(prev => ({
        ...prev,
        itemsToBring: [...prev.itemsToBring, itemInput.trim()]
      }));
      setItemInput('');
    }
  };

  const handleRemoveItem = (item: string) => {
    setNewPlan(prev => ({
      ...prev,
      itemsToBring: prev.itemsToBring.filter(i => i !== item)
    }));
  };

  const handleAddPlan = async () => {
    if (!user || !newPlan.title.trim() || !newPlan.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDatePlan({
        title: newPlan.title.trim(),
        location: newPlan.location.trim(),
        description: newPlan.description.trim(),
        date: newPlan.date,
        time: newPlan.time,
        itemsToBring: newPlan.itemsToBring,
        category: newPlan.category,
        userId: user.uid
      });

      // Refresh plans
      const updatedPlans = await getDatePlans(user.uid);
      setPlans(updatedPlans);

      // Reset form
      setNewPlan({
        title: '',
        location: '',
        description: '',
        date: '',
        time: '',
        itemsToBring: [],
        category: 'romantic'
      });
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: "Date plan added successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add date plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="bg-gradient-to-br from-accent/30 to-primary/20 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your date plans...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Plan Our Next Adventure</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Date Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Romantic dinner..."
                  value={newPlan.title}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPlan.category} onValueChange={(value: any) => setNewPlan(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="romantic">💕 Romantic</SelectItem>
                    <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                    <SelectItem value="cozy">🏠 Cozy</SelectItem>
                    <SelectItem value="special">✨ Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where will this happen?"
                value={newPlan.location}
                onChange={(e) => setNewPlan(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this special plan..."
                value={newPlan.description}
                onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPlan.date}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newPlan.time}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Items to Bring</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add an item..."
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <Button type="button" onClick={handleAddItem} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {newPlan.itemsToBring.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => handleRemoveItem(item)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPlan}>
                Add Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

              {plan.itemsToBring.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>What to bring:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.itemsToBring.map((item, itemIndex) => (
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
                    {new Date(plan.date) >= new Date() ? 'Looking forward to this!' : 'Beautiful memory'}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  {new Date(plan.date) >= new Date() ? 'View Details' : 'Relive Memory'}
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