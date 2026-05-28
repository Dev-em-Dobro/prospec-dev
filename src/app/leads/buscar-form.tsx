"use client";

import { useActionState } from "react";
import { buscar, type BuscarState } from "@/actions/leads/buscar";

const initial: BuscarState = { kind: "idle" };

export function BuscarForm() {
  const [state, action, pending] = useActionState(buscar, initial);

  return (
    <div>
      <form action={action} className="flex flex-col gap-3 max-w-xl">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Termo</span>
          <input
            name="termo"
            type="text"
            required
            placeholder="barbearia"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Localização</span>
          <input
            name="localizacao"
            type="text"
            required
            placeholder="Curitiba PR"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Buscando..." : "Buscar Leads"}
        </button>
      </form>

      {state.kind === "erro" && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.mensagem}
        </p>
      )}

      {state.kind === "ok" && (
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            {state.resultados.length} resultado(s) para{" "}
            <strong>{state.query}</strong>
          </p>
          {state.resultados.length > 0 && (
            <table className="mt-3 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-3">Nome</th>
                  <th className="py-2 pr-3">Categoria</th>
                  <th className="py-2 pr-3">Endereço</th>
                  <th className="py-2 pr-3">Telefone</th>
                  <th className="py-2 pr-3">Website</th>
                </tr>
              </thead>
              <tbody>
                {state.resultados.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 align-top">
                    <td className="py-2 pr-3 font-medium">{r.nome}</td>
                    <td className="py-2 pr-3 text-gray-600">{r.categoria}</td>
                    <td className="py-2 pr-3 text-gray-600">{r.endereco}</td>
                    <td className="py-2 pr-3">{r.telefone ?? "—"}</td>
                    <td className="py-2 pr-3">
                      {r.website ? (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          abrir
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
