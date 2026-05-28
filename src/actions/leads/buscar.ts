"use server";

import { z } from "zod";
import {
  PlacesError,
  textSearch,
  type PlacesResult,
} from "@/lib/places/textSearch";

const schema = z.object({
  termo: z
    .string()
    .trim()
    .min(2, "Termo precisa ter ao menos 2 caracteres")
    .max(80, "Termo muito longo"),
  localizacao: z
    .string()
    .trim()
    .min(2, "Localização precisa ter ao menos 2 caracteres")
    .max(80, "Localização muito longa"),
});

export type BuscarState =
  | { kind: "idle" }
  | { kind: "ok"; resultados: PlacesResult[]; query: string }
  | { kind: "erro"; mensagem: string };

export async function buscar(
  _prev: BuscarState,
  formData: FormData,
): Promise<BuscarState> {
  const parsed = schema.safeParse({
    termo: formData.get("termo"),
    localizacao: formData.get("localizacao"),
  });

  if (!parsed.success) {
    const primeiro = parsed.error.issues[0];
    return {
      kind: "erro",
      mensagem: primeiro?.message ?? "Input inválido",
    };
  }

  const query = `${parsed.data.termo} em ${parsed.data.localizacao}`;

  try {
    const resultados = await textSearch(query);
    return { kind: "ok", resultados, query };
  } catch (e) {
    if (e instanceof PlacesError) {
      const detalhe = e.message.slice(0, 300);
      return {
        kind: "erro",
        mensagem:
          e.status === 0
            ? detalhe
            : `Places API (${e.status}): ${detalhe}`,
      };
    }
    return {
      kind: "erro",
      mensagem: e instanceof Error ? e.message : "Erro desconhecido",
    };
  }
}
