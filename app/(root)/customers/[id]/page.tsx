import CustomerTracking from "@/components/pages/customers/CustomerTracking";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CustomerTracking customerId={id} />;
}
