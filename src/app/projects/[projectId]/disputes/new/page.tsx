
import React from 'react';
import DisputeForm from '@/components/project/DisputeForm';

interface NewDisputePageProps {
  params: {
    projectId: string;
  };
  searchParams: {
    workVersionId: string;
    respondentId: string;
  };
}

export default async function NewDisputePage({
  params,
  searchParams
}: NewDisputePageProps) {
  const { workVersionId, respondentId } = searchParams;

  if (!workVersionId || !respondentId) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Create Dispute</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Missing required parameters. Please provide workVersionId and respondentId.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create Dispute</h1>
      <DisputeForm
        projectId={params.projectId}
        workVersionId={workVersionId}
        respondentId={respondentId}
      />
    </div>
  );
}
