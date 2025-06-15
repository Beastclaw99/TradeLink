
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UpdateType, ProjectUpdateMetadata, ExpenseMetadata, DelayMetadata } from '@/types/projectUpdates';

interface MetadataFieldsProps {
  selectedType: UpdateType;
  metadata: ProjectUpdateMetadata;
  setMetadata: (metadata: ProjectUpdateMetadata) => void;
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
                value={(metadata as ExpenseMetadata).amount || ''}
                onChange={(e) => setMetadata({
                  amount: e.target.value,
                  description: (metadata as ExpenseMetadata).description || ''
                })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={(metadata as ExpenseMetadata).description || ''}
                onChange={(e) => setMetadata({
                  amount: (metadata as ExpenseMetadata).amount || '',
                  description: e.target.value
                })}
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
              value={(metadata as DelayMetadata).delay_reason || ''}
              onChange={(e) => setMetadata({ delay_reason: e.target.value })}
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
