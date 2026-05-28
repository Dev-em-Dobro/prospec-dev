import { BuscarForm } from "./buscar-form";

export default function LeadsPage() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Leads</h1>
      <p className="mt-1 text-sm text-gray-600">
        F001 — busca no Google Places. Sem persistência ainda.
      </p>
      <div className="mt-6">
        <BuscarForm />
      </div>
    </main>
  );
}
