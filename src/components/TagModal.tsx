
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
import { useChat } from '@/context/ChatContext';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string | null;
}

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
  const [existingTags, setExistingTags] = useState<Array<{name: string, color: string}>>([]);
  
  const { toast } = useToast();
  const { allChats, tagChat } = useChat();
  
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
      
      // Extract existing tags from all chats
      const tagsSet = new Set<string>();
      const tagsMap = new Map<string, string>();
      
      allChats.forEach(chat => {
        if (chat.tag) {
          tagsSet.add(chat.tag.name);
          tagsMap.set(chat.tag.name, chat.tag.color);
        }
      });
      
      const uniqueTags = Array.from(tagsSet).map(tagName => ({
        name: tagName,
        color: tagsMap.get(tagName) || colorOptions[0]
      }));
      
      setExistingTags(uniqueTags);
    } else {
      setAnimateIn(false);
      setSelectedTag(null);
      setNewTagName('');
      setIsCreatingNew(false);
    }
  }, [isOpen, allChats]);
  
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
    if (!chatId) {
      toast({
        title: "Error",
        description: "No chat selected.",
        variant: "destructive",
      });
      return;
    }
    
    if (isCreatingNew && !newTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for your new tag.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTag && !isCreatingNew) {
      toast({
        title: "No tag selected",
        description: "Please select an existing tag or create a new one.",
        variant: "destructive",
      });
      return;
    }
    
    // Use the selected existing tag or create a new one
    if (isCreatingNew) {
      // Create new tag
      tagChat(chatId, newTagName, selectedColor);
    } else if (selectedTag) {
      // Use existing tag
      const tagColor = existingTags.find(t => t.name === selectedTag)?.color || colorOptions[0];
      tagChat(chatId, selectedTag, tagColor);
    }
    
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
          {existingTags.length > 0 && (
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
              </div>
            </div>
          )}
          
          <div>
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
