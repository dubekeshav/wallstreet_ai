
import React, { useState } from 'react';
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
import { Tag, Plus } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string | null;
}

// Mock existing tags
const existingTags = [
  { name: 'Stocks', color: '#4f46e5' },
  { name: 'Learning', color: '#06b6d4' },
  { name: 'Crypto', color: '#7c3aed' },
  { name: 'Retirement', color: '#10b981' },
  { name: 'Research', color: '#f59e0b' }
];

// Predefined colors for new tags
const colorOptions = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#7c3aed', // violet
  '#ec4899', // pink
  '#6b7280', // gray
];

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, chatId }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const { toast } = useToast();
  
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Add Tag to Chat
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Existing Tag</h3>
            <div className="flex flex-wrap gap-2">
              {existingTags.map((tag) => (
                <button
                  key={tag.name}
                  className={`px-3 py-1.5 rounded-full text-white text-sm transition-transform ${
                    selectedTag === tag.name ? 'ring-2 ring-offset-2 scale-105' : ''
                  }`}
                  style={{ backgroundColor: tag.color }}
                  onClick={() => handleSelectTag(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm transition-transform ${
                  isCreatingNew ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''
                }`}
                onClick={handleCreateMode}
              >
                <Plus className="h-3.5 w-3.5" />
                New Tag
              </button>
            </div>
          </div>
          
          {isCreatingNew && (
            <div className="space-y-4">
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
                      className={`h-8 w-8 rounded-full transition-transform ${
                        selectedColor === color ? 'ring-2 ring-offset-2 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div 
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: selectedColor }}
                >
                  {newTagName || 'New Tag'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagModal;
