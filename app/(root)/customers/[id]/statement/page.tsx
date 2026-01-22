import CustomerStatement from "@/components/pages/CustomerStatement";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StatementPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-6">
      <CustomerStatement customerId={id} />
    </div>
  );
}
