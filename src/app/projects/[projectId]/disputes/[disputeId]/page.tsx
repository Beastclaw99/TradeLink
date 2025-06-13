import DisputeDetail from '@/components/project/DisputeDetail';

interface DisputeDetailPageProps {
  params: {
    projectId: string;
    disputeId: string;
  };
}

export default function DisputeDetailPage({ params }: DisputeDetailPageProps) {
  return (
    <div className="container mx-auto py-8">
      <DisputeDetail
        projectId={params.projectId}
        disputeId={params.disputeId}
      />
    </div>
  );
} 