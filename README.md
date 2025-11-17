<h1 align="center">
    <a">Nortus - Dashboard de Seguros</a>
</h1>

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/5fc85106-6a85-4caf-bfa7-06a5456fa833" />

<h3 align="center">
    <a">Dashboard para gestão de seguros com chat assistido por IA, análise de KPIs e simulação de planos.</a>
</h3>

## Como rodar

Primeiro, instala as dependências:

```bash
npm install
```

Depois é só rodar em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação vai abrir em `http://localhost:3000`. Por padrão redireciona pra página de login.

Para build de produção:

```bash
npm run build
npm start
```

## Funcionalidades

### Dashboard
- Visualização de KPIs principais (ARPU, Retenção, Churn, Conversão)
- Gráficos interativos com ApexCharts mostrando tendências ao longo do tempo
- Mapa interativo com Leaflet mostrando localizações e pontos de interesse
- Filtros por localização e tipo de dados

### Chat com IA
- Chat em tempo real com assistente virtual
- Sugestões automáticas da IA baseadas na conversa
- Ações rápidas: enviar proposta, fazer ligação, ver histórico
- Indicadores de leitura e timestamps

### Tickets
- Sistema de gerenciamento de tickets/chamados
- Filtros e busca
- Status e categorização

### Simulador de Planos
- Calculadora de planos de seguro (Básico, Intermediário, Premium)
- Seleção de coberturas adicionais
- Cálculo dinâmico de preços baseado em valor do veículo e idade do cliente
- Métricas de conversão e ROI por plano

### Autenticação
- Login com JWT
- Proteção de rotas
- Context API para gerenciamento de estado de autenticação

## Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Hook Form + Zod** - Formulários e validação
- **ApexCharts** - Gráficos e visualizações
- **Leaflet** - Mapas interativos
- **Axios** - Cliente HTTP
- **Sonner** - Notificações toast
- **next-intl** - Internacionalização (preparado)

## Estrutura do projeto

```
├── app/
│   ├── (auth)/          # Rotas de autenticação
│   ├── (protected)/     # Rotas protegidas (dashboard)
│   └── globals.css      # Estilos globais
├── components/          # Componentes reutilizáveis
├── contexts/           # Context providers (Auth, Tickets)
├── lib/                # Utilitários e APIs
├── schemas/            # Schemas de validação Zod
└── types/              # Tipos TypeScript
```

## Scripts disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Roda o linter
- `npm run format` - Formata código com Prettier

## API

O projeto consome uma API mock hospedada na AWS S3. Os endpoints estão documentados no arquivo `Doc.md`.
