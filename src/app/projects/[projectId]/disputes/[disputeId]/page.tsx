
'use client';

import { useParams } from 'next/navigation';
import DisputeDetail from '@/components/project/DisputeDetail';

export default function DisputeDetailPage() {
  const params = useParams();
  const disputeId = params.disputeId as string;
  const projectId = params.projectId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <DisputeDetail disputeId={disputeId} projectId={projectId} />
    </div>
  );
}
