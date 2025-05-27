
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface Document {
  id: string;
  type: string;
  name: string;
  status: 'verified' | 'pending' | 'expired' | 'rejected';
  expiryDate?: string;
  uploadedDate: string;
}

const ComplianceUploadForm: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'Insurance Certificate',
      name: 'liability-insurance-2024.pdf',
      status: 'verified',
      expiryDate: '2024-12-31',
      uploadedDate: '2024-01-15'
    },
    {
      id: '2',
      type: 'Trade License',
      name: 'plumbing-license.pdf',
      status: 'pending',
      expiryDate: '2025-06-30',
      uploadedDate: '2024-01-20'
    },
    {
      id: '3',
      type: 'Safety Certification',
      name: 'safety-cert-2023.pdf',
      status: 'expired',
      expiryDate: '2024-01-01',
      uploadedDate: '2023-01-15'
    }
  ]);

  const documentTypes = [
    'Insurance Certificate',
    'Trade License',
    'Safety Certification',
    'Business Registration',
    'Tax Clearance',
    'Professional Qualification'
  ];

  const statusConfig = {
    verified: { 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle, 
      text: 'Verified' 
    },
    pending: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: FileText, 
      text: 'Pending Review' 
    },
    expired: { 
      color: 'bg-red-100 text-red-800', 
      icon: AlertTriangle, 
      text: 'Expired' 
    },
    rejected: { 
      color: 'bg-red-100 text-red-800', 
      icon: AlertTriangle, 
      text: 'Rejected' 
    }
  };

  const handleFileUpload = (type: string) => {
    // TODO: Implement actual file upload
    console.log('Uploading file for:', type);
    alert(`File upload for ${type} - Integration needed (Placeholder)`);
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Compliance Documents</CardTitle>
          <p className="text-sm text-gray-600">
            Upload required certificates and licenses to maintain platform compliance
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <select 
                id="document-type"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select document type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date (if applicable)</Label>
              <Input
                id="expiry-date"
                type="date"
                placeholder="Select expiry date"
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Button variant="outline">
              Choose File
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => {
              const StatusIcon = statusConfig[doc.status].icon;
              const isExpiring = isExpiringSoon(doc.expiryDate);
              
              return (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-medium">{doc.type}</h4>
                        <p className="text-sm text-gray-600">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                          {doc.expiryDate && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isExpiring && doc.status === 'verified' && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expiring Soon
                        </Badge>
                      )}
                      <Badge className={statusConfig[doc.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[doc.status].text}
                      </Badge>
                    </div>
                  </div>
                  
                  {(doc.status === 'expired' || doc.status === 'rejected' || isExpiring) && (
                    <div className="mt-3 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFileUpload(doc.type)}
                      >
                        Upload New Document
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.status === 'expired').length}
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {documents.filter(d => isExpiringSoon(d.expiryDate)).length}
              </div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceUploadForm;
