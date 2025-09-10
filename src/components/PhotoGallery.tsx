import { useState, useEffect, useRef } from 'react';
import { Calendar, Heart, ArrowLeft, ArrowRight, Image as ImageIcon, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Photo, addPhoto, getPhotos } from '@/firebase/firestore';
import { uploadPhotoForMonth } from '@/firebase/storage';

export const PhotoGallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    location: '',
    isFavorite: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadPhotos = async () => {
      try {
        const userPhotos = await getPhotos(user.uid);
        setPhotos(userPhotos);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load photos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [user, toast]);

  const getCurrentMonthPhoto = () => {
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return photos.find(photo => photo.month === currentMonth);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddPhoto = async () => {
    if (!user || !selectedFile || !newPhoto.caption.trim()) {
      toast({
        title: "Error",
        description: "Please select an image and add a caption",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadPhotoForMonth(selectedFile, user.uid, currentMonth);

      // Save photo metadata to Firestore
      await addPhoto({
        month: currentMonth,
        imageUrl,
        caption: newPhoto.caption.trim(),
        location: newPhoto.location.trim() || undefined,
        isFavorite: newPhoto.isFavorite,
        userId: user.uid
      });

      // Refresh photos
      const updatedPhotos = await getPhotos(user.uid);
      setPhotos(updatedPhotos);

      // Reset form
      setNewPhoto({
        caption: '',
        location: '',
        isFavorite: false
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: "Photo added successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const currentPhoto = getCurrentMonthPhoto();

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="bg-gradient-to-br from-accent/30 to-primary/20 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your photos...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                {currentPhoto.isFavorite && (
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
          {photos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.slice().map((photo, index) => {
                const photoDate = new Date(photo.month  + '-02');
                const isSelected = photo.month === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                
                return (
                  <Card
                    key={photo.id || photo.month}
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
                      {photo.isFavorite && (
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
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No photos yet. Start capturing your beautiful moments!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload new photo button */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 text-primary">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Add This Month's Photo</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Photo for {formatMonthYear(currentDate)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo-upload">Photo *</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {selectedFile ? selectedFile.name : 'Choose Photo'}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="caption">Caption *</Label>
              <Textarea
                id="caption"
                placeholder="Describe this beautiful moment..."
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where was this taken?"
                value={newPhoto.location}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="favorite" 
                checked={newPhoto.isFavorite}
                onCheckedChange={(checked) => setNewPhoto(prev => ({ ...prev, isFavorite: checked as boolean }))}
              />
              <Label htmlFor="favorite" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Mark as favorite
              </Label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleAddPhoto} disabled={uploading}>
                {uploading ? "Uploading..." : "Add Photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};