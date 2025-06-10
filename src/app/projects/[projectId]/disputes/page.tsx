
'use client';

import { useParams } from 'next/navigation';
import DisputeList from '@/components/project/DisputeList';

export default function DisputesPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Project Disputes</h1>
      <DisputeList projectId={projectId} />
    </div>
  );
}
