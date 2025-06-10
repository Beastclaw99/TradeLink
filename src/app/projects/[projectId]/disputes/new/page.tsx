
'use client';

import { useParams } from 'next/navigation';
import DisputeForm from '@/components/project/DisputeForm';

export default function NewDisputePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Dispute</h1>
      <DisputeForm projectId={projectId} />
    </div>
  );
}
