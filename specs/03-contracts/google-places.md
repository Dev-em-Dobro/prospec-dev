# Contrato — Google Places API (New)

Versão usada: **Places API (New)** — endpoint v1, não a Places API legacy.

Doc oficial: https://developers.google.com/maps/documentation/places/web-service/text-search

## Autenticação
- Header `X-Goog-Api-Key: ${GOOGLE_PLACES_API_KEY}`
- A chave deve ter a **Places API (New)** habilitada no projeto Google Cloud
  (não a "Places API" antiga).

## Endpoint usado na F001 — Text Search
`POST https://places.googleapis.com/v1/places:searchText`

### Headers
```
Content-Type: application/json
X-Goog-Api-Key: <chave>
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.primaryType,places.types
```

> **Atenção:** sem `X-Goog-FieldMask` a request falha com **400**.
> A FieldMask determina o **SKU** cobrado. A cobrança é pelo SKU mais alto
> disparado pela request (não soma):
>
> | SKU         | Campos que disparam                                              | Free tier / mês | Preço      |
> |-------------|------------------------------------------------------------------|-----------------|------------|
> | IDs Only    | `id`, `name`, `attributions`                                     | ilimitado       | grátis     |
> | Pro         | + `displayName`, `formattedAddress`, `primaryType`, `types`      | 5.000           | $32 / 1k   |
> | Enterprise  | + `nationalPhoneNumber`, `websiteUri`                            | 1.000           | $35 / 1k   |
>
> A FieldMask escolhida aqui dispara o **Enterprise SKU**.

### Body
```json
{
  "textQuery": "barbearia em Curitiba PR",
  "languageCode": "pt-BR",
  "regionCode": "BR",
  "maxResultCount": 20
}
```

### Resposta (sucesso 200)
```json
{
  "places": [
    {
      "id": "ChIJ...",
      "displayName": { "text": "Barbearia X", "languageCode": "pt-BR" },
      "formattedAddress": "Rua Y, 123 - Curitiba, PR",
      "nationalPhoneNumber": "(41) 9999-9999",
      "websiteUri": "https://exemplo.com",
      "primaryType": "barber_shop",
      "types": ["barber_shop", "point_of_interest", "establishment"]
    }
  ]
}
```

Campos `nationalPhoneNumber` e `websiteUri` podem estar **ausentes**
(não vêm como `null`, simplesmente não aparecem no objeto).

### Erros relevantes
| Status | Causa típica                           | Tratamento                              |
|--------|----------------------------------------|-----------------------------------------|
| 400    | FieldMask ausente ou inválida          | Bug nosso — propagar mensagem ao dev    |
| 401/403| Chave inválida ou API não habilitada   | Erro descritivo na UI                   |
| 429    | Quota excedida                         | Erro descritivo na UI, sugerir aguardar |
| 5xx    | Indisponibilidade Google               | Erro genérico na UI                     |

Corpo de erro:
```json
{ "error": { "code": 400, "message": "...", "status": "INVALID_ARGUMENT" } }
```

## Tipo TypeScript esperado em `src/lib/places/`
```ts
export type PlacesResult = {
  id: string;
  nome: string;
  endereco: string;
  telefone: string | null;
  website: string | null;
  categoria: string;
};

export async function textSearch(query: string): Promise<PlacesResult[]>;
```

A camada `lib/places` é responsável por:
1. Montar headers (incluindo a `FieldMask`).
2. Mapear a resposta crua → `PlacesResult` (já com a linguagem ubíqua do domínio).
3. Lançar erro tipado em falhas HTTP (com `status` e `message`).

A Server Action consome esse tipo, **não** o JSON cru do Google.

## Fora deste contrato
- **Place Details** (`places/{id}` GET) — será adicionado quando o
  Diagnóstico (F002) precisar de dados confiáveis de telefone/website.
- **Nearby Search** (`places:searchNearby`) — não usado na F001.
- **Paginação** (`pageToken`) — não usado na F001.
