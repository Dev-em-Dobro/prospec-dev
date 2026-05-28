import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">prospec-dev</h1>
      <p className="mt-2 text-gray-600">Ferramenta interna de prospecção.</p>
      <Link
        href="/leads"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        → ir para Leads
      </Link>
    </main>
  );
}
