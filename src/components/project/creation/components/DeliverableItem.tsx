
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Deliverable } from '../types';

interface DeliverableItemProps {
  deliverable: Deliverable;
  onUpdate: (deliverable: Deliverable) => void;
  onDelete: () => void;
}

export const DeliverableItem: React.FC<DeliverableItemProps> = ({
  deliverable,
  onUpdate,
  onDelete
}) => {
  const handleUpdate = (field: keyof Deliverable, value: any) => {
    onUpdate({
      ...deliverable,
      [field]: value
    });
  };

  return (
    <div className="space-y-3 p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Deliverable title"
          value={deliverable.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
          className="flex-1 mr-2"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        placeholder="Deliverable description"
        value={deliverable.description}
        onChange={(e) => handleUpdate('description', e.target.value)}
        rows={2}
      />
      
      <div className="flex gap-2">
        <Select
          value={deliverable.deliverable_type}
          onValueChange={(value) => handleUpdate('deliverable_type', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="file">File</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Content or file details"
          value={deliverable.content}
          onChange={(e) => handleUpdate('content', e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};
