import { useState } from 'react';
import { Calendar, Heart, ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MonthlyPhoto {
  month: string;
  imageUrl: string;
  caption: string;
  location?: string;
  favorite?: boolean;
}

// Sample photos - you'll replace these with your Firebase Storage URLs
const samplePhotos: MonthlyPhoto[] = [
  {
    month: "2024-01",
    imageUrl: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=600&fit=crop",
    caption: "Our cozy coffee date on a snowy morning. Your smile warmed my heart more than the hot chocolate ever could.",
    location: "Downtown Café",
    favorite: true
  },
  {
    month: "2024-02",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    caption: "Valentine's Day dinner by candlelight. Every moment with you feels like a celebration of love.",
    location: "Italian Restaurant",
    favorite: false
  },
  {
    month: "2024-03",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    caption: "Spring hiking adventure together. Getting lost in nature, but always finding our way back to each other.",
    location: "Mountain Trail",
    favorite: true
  },
  {
    month: "2024-04",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    caption: "Beach sunset picnic. Watching the waves while planning our future together.",
    location: "Sunset Beach",
    favorite: false
  },
  {
    month: "2024-05",
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop",
    caption: "Cooking together in our kitchen. Making memories one recipe at a time.",
    location: "Our Home",
    favorite: true
  },
  {
    month: "2024-06",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    caption: "Dancing under the stars at the summer festival. Every dance with you feels like magic.",
    location: "City Festival",
    favorite: false
  }
];

export const PhotoGallery = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhoto, setSelectedPhoto] = useState<MonthlyPhoto | null>(null);

  const getCurrentMonthPhoto = () => {
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return samplePhotos.find(photo => photo.month === currentMonth);
  };

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

  const currentPhoto = getCurrentMonthPhoto();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Month's Photo */}
      <Card className="bg-gradient-to-br from-accent/30 to-primary/20 backdrop-blur-sm border-border/50 love-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ImageIcon className="w-6 h-6 text-primary romantic-float" />
            Picture of the Month - {formatMonthYear(currentDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPhoto ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={currentPhoto.imageUrl}
                  alt={`Photo from ${formatMonthYear(currentDate)}`}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {currentPhoto.favorite && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full animate-heart-beat">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg leading-relaxed text-foreground italic">
                  "{currentPhoto.caption}"
                </p>
                {currentPhoto.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{currentPhoto.location}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 gentle-pulse" />
              <p className="text-muted-foreground text-lg">
                No photo for this month yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Let's create some beautiful memories to capture!
              </p>
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
          <span>Browse Gallery</span>
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

      {/* Photo Archive Grid */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Our Memory Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {samplePhotos.slice().reverse().map((photo, index) => {
              const photoDate = new Date(photo.month + '-01');
              const isSelected = photo.month === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
              
              return (
                <Card
                  key={photo.month}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden ${
                    isSelected ? 'ring-2 ring-primary' : 'hover:scale-[1.02]'
                  }`}
                  onClick={() => setCurrentDate(photoDate)}
                >
                  <div className="relative">
                    <img
                      src={photo.imageUrl}
                      alt={`Memory from ${photoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      className="w-full h-32 object-cover"
                    />
                    {photo.favorite && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                        <Heart className="w-3 h-3 fill-current" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-white text-sm font-medium">
                        {photoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {photo.caption}
                    </p>
                    {photo.location && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {photo.location}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload new photo button */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Add This Month's Photo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};