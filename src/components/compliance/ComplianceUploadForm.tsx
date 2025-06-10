
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
}

const ComplianceUploadForm: React.FC = () => {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Business License.pdf',
      type: 'license',
      status: 'approved',
      uploadDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Insurance Certificate.pdf',
      type: 'insurance',
      status: 'pending',
      uploadDate: '2024-01-20'
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && documentType) {
      console.log('Uploading:', selectedFile.name, 'Type:', documentType);
      // Here you would typically upload to your backend/storage
      setSelectedFile(null);
      setDocumentType('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="license">Business License</SelectItem>
                <SelectItem value="insurance">Insurance Certificate</SelectItem>
                <SelectItem value="certification">Professional Certification</SelectItem>
                <SelectItem value="permit">Work Permit</SelectItem>
                <SelectItem value="tax">Tax Registration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Choose File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || !documentType}
                className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
              >
                Upload
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="w-5 h-5" />
            Your Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No documents uploaded yet. Upload your first compliance document above.
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Business License</span>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Insurance Certificate</span>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Professional Certification</span>
              <Badge className="bg-gray-100 text-gray-800">Not Submitted</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceUploadForm;
