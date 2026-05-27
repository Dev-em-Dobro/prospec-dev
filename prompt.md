Prompt
Crie a estrutura inicial do projeto **prospec-dev** seguindo Spec-Driven Development.

## Contexto do projeto
Sistema de prospecção automatizada para freelancers de desenvolvimento.
O sistema coleta estabelecimentos via Google Places API, identifica negócios
com presença digital fraca (sem site, site lento, sem HTTPS, etc.),
prioriza por score, e gera mensagens de outreach personalizadas via Claude API.
Usuário: 1 (eu, freelancer). Não é SaaS — é ferramenta interna.

## Stack decidida
- Next.js 15 (App Router) + TypeScript estrito
- PostgreSQL via Neon
- Prisma ORM
- Tailwind + shadcn/ui
- Claude API para geração de outreach
- Google Places API + PageSpeed Insights API
- SEM workers, SEM filas — tudo em Server Actions síncronas na Fase 1

## Tarefas

### 1. Criar a estrutura de pastas exata abaixo
Crie pastas vazias com um `.gitkeep` onde não houver arquivo ainda.

```
prospec-dev/
├── specs/
│   ├── 00-product-vision.md
│   ├── 01-domain-model.md
│   ├── 02-features/
│   │   └── .gitkeep
│   ├── 03-contracts/
│   │   └── .gitkeep
│   └── 04-decisions/
│       ├── ADR-001-stack-typescript-nextjs.md
│       ├── ADR-002-sem-workers-fase-1.md
│       ├── ADR-003-prisma-orm.md
│       └── ADR-004-neon-postgres.md
├── src/
│   ├── app/
│   │   └── .gitkeep
│   ├── lib/
│   │   └── .gitkeep
│   ├── actions/
│   │   └── .gitkeep
│   └── components/
│       └── .gitkeep
├── prisma/
│   └── .gitkeep
├── CLAUDE.md
├── README.md
└── .gitignore
```

### 2. Escrever os arquivos com conteúdo

**CLAUDE.md** — Regras pro agente:
- Specs em /specs são fonte da verdade
- Mudança de comportamento exige mudança de spec ANTES do código
- Toda feature tem ID (F00X), commits referenciam ID
- Linguagem ubíqua definida em /specs/01-domain-model.md — não usar sinônimos
- Stack fixa (lista acima), nova lib só com ADR
- Lógica de domínio em src/lib/ (sem dependência de Next)
- Server Actions em src/actions/ (finas, só orquestram lib/)
- Validação de input com Zod nas Server Actions
- Tipos derivados do schema Prisma, não duplicados
- Fluxo: ler spec → atualizar plano → implementar → validar contra critérios de aceitação

**README.md** — Curto: o que é o projeto, como rodar localmente, link pra specs.

**.gitignore** — Padrão Next.js + Prisma + .env.

**specs/00-product-vision.md** — Uma página com:
- Usuário (freelancer dev, 1 pessoa)
- Problema (prospecção manual via boca-a-boca consome tempo)
- Solução (sistema que acha leads qualificados automaticamente)
- Resultado esperado (10 leads qualificados por semana sem prospecção manual)
- Restrições (LGPD, orçamento de APIs baixo, ferramenta interna)
- Fora de escopo na Fase 1 (multi-tenant, envio automático de mensagens, mobile)

**specs/01-domain-model.md** — Entidades centrais com linguagem ubíqua:
- **Lead**: estabelecimento coletado. Campos: id, nome, endereço, telefone, website, categoria, place_id (Google), status (novo|enriquecido|priorizado|contatado|respondeu|ganho|perdido), score (0-100), created_at, updated_at
- **Diagnostico**: análise técnica de um Lead. Campos: lead_id, tem_site (bool), performance_mobile (0-100|null), tem_https (bool|null), tempo_carregamento_ms (int|null), executado_em
- **Dor**: problema detectado num Lead. Campos: lead_id, tipo (SEM_SITE|SITE_LENTO|SEM_HTTPS|SEM_RESPOSTA_REVIEWS|etc), severidade (BAIXA|MEDIA|ALTA), detalhes
- **Outreach**: mensagem gerada. Campos: lead_id, canal (whatsapp|email), conteudo, gerado_em, enviado (bool)

Inclui glossário no fim alertando contra sinônimos (é "Lead", não "prospect"; "Diagnóstico", não "análise").

### 3. Escrever os 4 ADRs

Use o template padrão (Status, Contexto, Decisão, Alternativas consideradas, Consequências). Conteúdo:

**ADR-001 — Stack TypeScript + Next.js**
- Contexto: dev solo, quer um stack só, deploy simples, prefere TS a Python
- Decisão: Next.js 15 App Router + TS estrito, monolito
- Alternativas: Python + FastAPI + frontend separado (mais complexo); Python + Streamlit (limitado pra crescer); Django + Admin (Python, descartado por preferência)
- Consequências: produtividade alta, deploy num clique na Vercel; perde ecossistema Python de scraping/ML (aceitável pro escopo atual)

**ADR-002 — Sem workers/filas na Fase 1**
- Contexto: 1 usuário, operações esporádicas, tolerância a 30s de latência
- Decisão: todas as operações via Server Actions síncronas; sem Celery, Redis, Inngest, Vercel Cron
- Alternativas: Inngest (overkill agora); Vercel Cron (não precisa de scheduling ainda); BullMQ + Redis (infra demais)
- Consequências: simplicidade máxima; UI bloqueia em operações longas (aceitável); quando precisar, lógica em src/lib/ já isola e facilita migração

**ADR-003 — Prisma ORM**
- Contexto: precisa de ORM TS-first com bom suporte a Postgres
- Decisão: Prisma ORM
- Alternativas: Prisma (DX melhor mas mais pesado, schema próprio); Kysely (query builder puro, menos features); SQL puro com pg (verboso pra CRUD)
- Consequências: SQL-like API, bundle pequeno, migrations explícitas; curva de aprendizado se vier de Prisma

**ADR-004 — Neon como provedor de Postgres**
- Contexto: precisa de Postgres gerenciado, free tier, scale-to-zero
- Decisão: Neon (neon.tech)
- Alternativas: Supabase (features demais pro escopo); Railway/Fly Postgres ($5/mês fixo, sem scale-to-zero); SQLite + Turso (perde JSONB e full-text)
- Consequências: free tier suficiente; branching facilita testes; cold start de ~500ms; reavaliar se virar multi-tenant

### 4. Saída
Ao final, liste:
- Caminho de todos os arquivos criados
- Próximos passos sugeridos (escrever F001, configurar Neon, `npm create next-app`, etc.)

Não execute `npm install` nem inicialize o Next.js ainda — só a estrutura de specs e ADRs. A inicialização do Next vem depois, num próximo passo.