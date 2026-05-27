# 00 — Product Vision

## Usuário
Um freelancer dev (eu), operando solo. Não há multi-tenant, equipe ou cliente
externo usando o sistema. Ferramenta interna.

## Problema
Prospecção manual via boca-a-boca, indicação e busca aleatória em mapa consome
tempo, é inconsistente e não escala. Não há método repetível pra identificar
negócios locais que de fato precisam de um dev (site ruim, lento, ou sem site)
antes de iniciar uma abordagem.

## Solução
Um sistema que:
1. Coleta estabelecimentos por região/categoria via Google Places API
2. Diagnostica a presença digital de cada um (site, HTTPS, performance mobile)
3. Detecta **Dores** concretas (sem site, site lento, sem HTTPS, etc.)
4. Calcula um **score** (0–100) e prioriza
5. Gera mensagens de outreach personalizadas via Claude API
6. Mostra tudo numa dashboard simples onde marco o status manualmente

## Resultado esperado
**10 Leads qualificados por semana, sem prospecção manual ativa.**

"Qualificado" = score acima de um threshold definido + Diagnóstico executado +
ao menos uma Dor detectada + Outreach gerado e pronto pra enviar.

## Restrições
- **LGPD**: só dados públicos (Google Places). Sem enriquecimento via dados
  pessoais. Sem disparos automáticos sem consentimento — envio é manual.
- **Orçamento de APIs baixo**: Google Places, PageSpeed e Claude API têm
  custo. Operar dentro do free tier ou em valores marginais (~R$50/mês teto).
- **Ferramenta interna**: sem auth multi-usuário, sem SLA, sem onboarding.
  Otimizar pra um único operador.
- **Tempo**: operações podem levar até 30s (síncronas). Aceitável.

## Fora de escopo na Fase 1
- Multi-tenant / multi-usuário
- Envio automático de mensagens (WhatsApp/email API)
- App mobile
- Dashboard de métricas históricas (analytics, funil)
- Integração com CRM externo (HubSpot, Pipedrive)
- Scraping fora do Google Places
- Enriquecimento via LinkedIn, Receita Federal, etc.
- Workers, filas, jobs agendados
