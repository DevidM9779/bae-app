import { useState, useEffect } from 'react';
import { Quote, Calendar, ArrowLeft, ArrowRight, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  LoveMessage, 
  addLoveMessage, 
  subscribeToLoveMessages 
} from '@/firebase/firestore';

export const LoveMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMessage, setSelectedMessage] = useState<LoveMessage | null>(null);
  const [messages, setMessages] = useState<LoveMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToLoveMessages(user.uid, (loveMessages) => {
      setMessages(loveMessages);
      setLoading(false);
      
      // Set current month's message
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const currentMessage = loveMessages.find(msg => msg.month === currentMonth);
      setSelectedMessage(currentMessage || loveMessages[0] || null);
    });

    return () => unsubscribe();
  }, [user, currentDate]);

  useEffect(() => {
    // Update selected message when date changes
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const currentMessage = messages.find(msg => msg.month === currentMonth);
    setSelectedMessage(currentMessage || null);
  }, [currentDate, messages]);

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

  const handleAddMessage = async () => {
    if (!user || !newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the message field",
        variant: "destructive"
      });
      return;
    }

    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      await addLoveMessage({
        month: currentMonth,
        message: newMessage.trim(),
        author: newAuthor.trim() || undefined,
        userId: user.uid
      });
      
      setNewMessage('');
      setNewAuthor('');
      setShowAddDialog(false);
      
      toast({
        title: "Success",
        description: "Love message added successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add message. Please try again.",
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
              <Quote className="w-8 h-8 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your love messages...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {selectedMessage ? (
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
          ) : (
            <div className="text-center py-8">
              <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No love message for this month yet
              </p>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Love Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Love Message for {formatMonthYear(currentDate)}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your love message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author (Optional)</Label>
                      <Input
                        id="author"
                        placeholder="Who wrote this message?"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMessage}>
                        Add Message
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
          {messages.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {messages.slice().map((message, index) => {
                let messageDate = new Date(`${message.month}-02`);
                const isSelected = message.month === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                
                return (
                  <Card
                    key={message.id || message.month}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/10' : 'bg-card hover:bg-secondary/30'
                    }`}
                    onClick={() => {
                      setCurrentDate(messageDate);
                      setSelectedMessage(message);
                      console.log(message.month+'-01')
                      console.log(messageDate)
                      console.log(messageDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
                    }}
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
          ) : (
            <div className="text-center py-8">
              <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No love messages yet. Start creating beautiful memories!
              </p>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add First Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Love Message for {formatMonthYear(currentDate)}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your love message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author (Optional)</Label>
                      <Input
                        id="author"
                        placeholder="Who wrote this message?"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMessage}>
                        Add Message
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};