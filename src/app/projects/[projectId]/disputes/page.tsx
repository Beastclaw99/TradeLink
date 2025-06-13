import DisputeList from '@/components/project/DisputeList';

interface DisputesPageProps {
  params: {
    projectId: string;
  };
}

export default function DisputesPage({ params }: DisputesPageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Disputes</h1>
      <DisputeList projectId={params.projectId} />
    </div>
  );
} 