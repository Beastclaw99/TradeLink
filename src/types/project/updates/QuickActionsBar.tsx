import { Button } from "@/components/ui/button";
import { QUICK_ACTIONS } from '@/components/project/updates/constants/quickActions';
import { UpdateType } from '@/types/projectUpdates';

interface QuickActionsBarProps {
  onQuickAction: (type: UpdateType) => void;
  isSubmitting: boolean;
}

export default function QuickActionsBar({ onQuickAction, isSubmitting }: QuickActionsBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {QUICK_ACTIONS.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="outline"
          className="flex items-center gap-2 min-w-fit"
          onClick={() => onQuickAction(type)}
          disabled={isSubmitting}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
