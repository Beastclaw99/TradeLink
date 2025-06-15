
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadSectionProps {
  file: File | null;
  filePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export default function FileUploadSection({
  file,
  filePreview,
  onFileChange,
  onClearFile
}: FileUploadSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="file">Attachment</Label>
      <Input
        id="file"
        type="file"
        onChange={onFileChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
      {filePreview && (
        <div className="mt-2">
          <div className="relative inline-block">
            <img
              src={filePreview}
              alt="Preview"
              className="max-h-32 rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={onClearFile}
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
