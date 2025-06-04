import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteProjectDialogProps {
  projectId: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete: (projectId: string) => Promise<void>;
}

export const DeleteProjectDialog = ({
  projectId,
  isSubmitting,
  onCancel,
  onDelete
}: DeleteProjectDialogProps) => {
  if (!projectId) return null;

  return (
    <Dialog open={!!projectId} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => onDelete(projectId)}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 