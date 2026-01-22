import StatementsPage from "@/components/pages/statement/StatementPage";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <StatementsPage />;
}
