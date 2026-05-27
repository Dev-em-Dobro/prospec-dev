# 01 — Domain Model

Linguagem ubíqua do prospec-dev. **Estes nomes são obrigatórios** em código,
UI, banco, commits e conversas. Sinônimos quebram a comunicação e devem
ser evitados — ver glossário no fim.

---

## Entidades

### Lead
Estabelecimento coletado da Google Places API. É a unidade central de trabalho.

| Campo         | Tipo                                                                            | Notas |
|---------------|---------------------------------------------------------------------------------|-------|
| `id`          | string (cuid)                                                                   | PK |
| `nome`        | string                                                                          | Nome do estabelecimento |
| `endereco`    | string                                                                          | Endereço formatado |
| `telefone`    | string \| null                                                                  | Quando exposto pelo Places |
| `website`     | string \| null                                                                  | URL do site (se houver) |
| `categoria`   | string                                                                          | Categoria primária do Places |
| `place_id`    | string                                                                          | ID estável do Google Places (único) |
| `status`      | enum: `novo` \| `enriquecido` \| `priorizado` \| `contatado` \| `respondeu` \| `ganho` \| `perdido` | Estado no funil |
| `score`       | int 0–100                                                                       | Calculado a partir das Dores |
| `created_at`  | datetime                                                                        | |
| `updated_at`  | datetime                                                                        | |

**Estados (`status`):**
- `novo` — recém-coletado, ainda sem Diagnóstico
- `enriquecido` — Diagnóstico executado, Dores detectadas
- `priorizado` — score calculado, pronto pra outreach
- `contatado` — Outreach enviado manualmente
- `respondeu` — Lead respondeu (positivo ou negativo)
- `ganho` — virou cliente
- `perdido` — não fechou (recusou, sumiu, etc.)

### Diagnóstico
Análise técnica da presença digital de um Lead. 1 Lead pode ter múltiplos
Diagnósticos ao longo do tempo (re-diagnóstico).

| Campo                  | Tipo               | Notas |
|------------------------|--------------------|-------|
| `id`                   | string             | PK |
| `lead_id`              | string             | FK → Lead |
| `tem_site`             | bool               | Verdadeiro se `Lead.website` resolve |
| `performance_mobile`   | int 0–100 \| null  | Score do PageSpeed Insights mobile |
| `tem_https`            | bool \| null       | `null` quando não há site |
| `tempo_carregamento_ms`| int \| null        | Tempo de carregamento medido |
| `executado_em`         | datetime           | Quando o Diagnóstico rodou |

### Dor
Problema concreto detectado num Lead a partir do Diagnóstico. Um Lead pode
ter várias Dores. É o que justifica o outreach.

| Campo        | Tipo                                                                                                  | Notas |
|--------------|-------------------------------------------------------------------------------------------------------|-------|
| `id`         | string                                                                                                | PK |
| `lead_id`    | string                                                                                                | FK → Lead |
| `tipo`       | enum: `SEM_SITE` \| `SITE_LENTO` \| `SEM_HTTPS` \| `SEM_RESPOSTA_REVIEWS` \| ... (extensível por spec) | Categoria da Dor |
| `severidade` | enum: `BAIXA` \| `MEDIA` \| `ALTA`                                                                    | Peso no score |
| `detalhes`   | string                                                                                                | Texto curto explicando a Dor |

### Outreach
Mensagem de abordagem gerada via Claude API pra um Lead. Pode haver várias
Outreaches por Lead (canais diferentes, reescritas, etc.).

| Campo        | Tipo                            | Notas |
|--------------|---------------------------------|-------|
| `id`         | string                          | PK |
| `lead_id`    | string                          | FK → Lead |
| `canal`      | enum: `whatsapp` \| `email`     | Canal-alvo |
| `conteudo`   | text                            | Texto final da mensagem |
| `gerado_em`  | datetime                        | |
| `enviado`    | bool                            | Marcado manualmente após envio |

---

## Relacionamentos

```
Lead 1 ─── N Diagnóstico
Lead 1 ─── N Dor
Lead 1 ─── N Outreach
```

---

## Glossário (linguagem ubíqua — alerta contra sinônimos)

| Use                | NÃO use                                                |
|--------------------|--------------------------------------------------------|
| **Lead**           | prospect, contato, empresa, cliente potencial, target  |
| **Diagnóstico**    | análise, auditoria, scan, check                        |
| **Dor**            | problema, issue, oportunidade, gap, pain point         |
| **Outreach**       | mensagem, abordagem, copy, contato (no sentido genérico) |
| **score**          | rating, ranking, nota, prioridade (como sinônimo)      |
| **place_id**       | google_id, gid, external_id                            |
| **status `contatado`** | enviado, abordado, prospectado                     |

**Regras:**
- Em **schema Prisma**, **código TS** e **UI**, use os nomes desta tabela.
- Em **commits e PRs**, idem. Ex.: `F003: calcular score do Lead a partir das Dores`.
- Se aparecer necessidade de um conceito novo, crie/atualize esta spec **antes**
  de implementá-lo.
