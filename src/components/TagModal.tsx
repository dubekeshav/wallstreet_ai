
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tag, Plus, X, Check } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string | null;
}

// Mock existing tags with warm tones suitable for cream/beige theme
const existingTags = [
  { name: 'Stocks', color: '#FF8C00' },     // Dark Orange
  { name: 'Learning', color: '#4682B4' },   // Steel Blue
  { name: 'Crypto', color: '#7B68EE' },     // Medium Slate Blue
  { name: 'Retirement', color: '#2E8B57' }, // Sea Green
  { name: 'Research', color: '#CD853F' }    // Peru
];

// Predefined colors for new tags (warm/earthy tones for cream/beige theme)
const colorOptions = [
  '#FF8C00', // Dark Orange
  '#CD853F', // Peru
  '#8B4513', // Saddle Brown
  '#2E8B57', // Sea Green
  '#4682B4', // Steel Blue
  '#7B68EE', // Medium Slate Blue
  '#800080', // Purple
  '#D2691E', // Chocolate
];

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, chatId }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);
  
  const handleSelectTag = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
      setIsCreatingNew(false);
    }
  };
  
  const handleCreateMode = () => {
    setIsCreatingNew(true);
    setSelectedTag(null);
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  
  const handleSave = () => {
    if (isCreatingNew && !newTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for your new tag.",
        variant: "destructive",
      });
      return;
    }
    
    const tagName = isCreatingNew ? newTagName : selectedTag;
    
    if (!tagName && !isCreatingNew) {
      toast({
        title: "No tag selected",
        description: "Please select an existing tag or create a new one.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tag added",
      description: `Chat tagged as "${isCreatingNew ? newTagName : tagName}".`,
      duration: 2000,
    });
    
    // Reset form and close modal
    setSelectedTag(null);
    setNewTagName('');
    setIsCreatingNew(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Add Tag to Chat
          </DialogTitle>
        </DialogHeader>
        
        <div className={`grid gap-4 py-4 transition-all duration-300 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Existing Tag</h3>
            <div className="flex flex-wrap gap-2">
              {existingTags.map((tag) => (
                <button
                  key={tag.name}
                  className={`px-3 py-1.5 rounded-full text-white text-sm transition-all duration-200 flex items-center gap-1 ${
                    selectedTag === tag.name ? 'ring-2 ring-offset-2 scale-105' : 'hover:opacity-80'
                  }`}
                  style={{ backgroundColor: tag.color }}
                  onClick={() => handleSelectTag(tag.name)}
                >
                  {selectedTag === tag.name && (
                    <Check className="h-3 w-3" />
                  )}
                  {tag.name}
                </button>
              ))}
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm transition-all duration-200 ${
                  isCreatingNew ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'hover:bg-accent/80'
                }`}
                onClick={handleCreateMode}
              >
                <Plus className="h-3.5 w-3.5" />
                New Tag
              </button>
            </div>
          </div>
          
          {isCreatingNew && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="tag-name" className="text-sm font-medium">
                  New Tag Name
                </label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="mt-1"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full transition-all duration-200 relative ${
                        selectedColor === color ? 'ring-2 ring-offset-2 scale-110' : 'hover:opacity-80'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      aria-label={`Select color ${color}`}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div 
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-white animate-pulse-slow"
                  style={{ backgroundColor: selectedColor }}
                >
                  {newTagName || 'New Tag'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-1">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 gap-1"
          >
            <Check className="h-4 w-4" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagModal;
