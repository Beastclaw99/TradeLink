
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UpdateType } from '@/types/projectUpdates';

interface MetadataFieldsProps {
  selectedType: UpdateType;
  metadata: any;
  setMetadata: (metadata: any) => void;
}

export default function MetadataFields({ selectedType, metadata, setMetadata }: MetadataFieldsProps) {
  const renderFields = () => {
    switch (selectedType) {
      case 'expense_submitted':
      case 'expense_approved':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={metadata.amount || ''}
                onChange={(e) => setMetadata({ ...metadata, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description || ''}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                placeholder="Enter expense description"
              />
            </div>
          </div>
        );
      
      case 'delayed':
        return (
          <div>
            <Label htmlFor="delay_reason">Reason for Delay</Label>
            <Textarea
              id="delay_reason"
              value={metadata.delay_reason || ''}
              onChange={(e) => setMetadata({ ...metadata, delay_reason: e.target.value })}
              placeholder="Enter reason for delay"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const fields = renderFields();
  if (!fields) return null;

  return <div className="space-y-4">{fields}</div>;
}
