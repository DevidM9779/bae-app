import { useState } from 'react';
import { Heart, Calendar, MessageCircle, Image, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import backgroundImage from '@/assets/romantic-background.jpg';
import { RelationshipCounters } from './RelationshipCounters';
import { LoveMessages } from './LoveMessages';
import { DatePlanner } from './DatePlanner';
import { PhotoGallery } from './PhotoGallery';

export const RomanticLayout = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div 
      className="min-h-screen soft-gradient relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 romantic-float">
            Our Love Story
          </h1>
          <p className="text-lg text-muted-foreground gentle-pulse">
            Every moment together is a treasure ✨
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-1 mb-8">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:romantic-gradient data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 data-[state=active]:romantic-gradient data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plans" 
              className="flex items-center gap-2 data-[state=active]:romantic-gradient data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="flex items-center gap-2 data-[state=active]:romantic-gradient data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="home" className="space-y-6">
            <RelationshipCounters />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <LoveMessages />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <DatePlanner />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <PhotoGallery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};