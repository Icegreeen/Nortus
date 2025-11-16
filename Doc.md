Documentação API
Informações Gerais
Base URL
https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2

Formato das Requisições

Todas as requisições são do tipo GET

Retornam dados no formato application/json

Endpoints
Autenticação
GET /login.json

Simula o retorno de um login básico com token JWT.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/login.json


Resposta:

{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "Usuário..."
  }
}

Dashboard
GET /dash.json

Indicadores principais da plataforma (ARPU, Churn, crescimento, mapa de impacto, clientes ativos).

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/dash.json


Resposta (exemplo):

{
  "kpisTrend": {
    "labels": ["Jan", "Fev", "Mar", "Abr"],
    "arpuTrend": {
      "name": "ARPU",
      "data": [120000, 135000]
    }
  }
}

Mapa
GET /map.json

Fornece dados de localização exibidos no mapa.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/map.json


Resposta:

{
  "data": {
    "center": [-34.8811, -8.0539],
    "zoom": 12,
    "locations": [
      {
        "id": "marco-zero",
        "name": "Marco Zero",
        "description": "Praça Rio Branco - Marco inicial de Pernambuco",
        "coordinates": [-34.8717, -8.0631],
        "category": "tourism",
        "address": "Praça Rio Branco - Recife Antigo, Recife - PE",
        "icon": "map-pin",
        "color": "#E74C3C"
      }
    ]
  }
}

Conversas
GET /chat.json

Histórico da conversa entre cliente e agente, incluindo sugestões e análises da IA.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/chat.json


Resposta:

{
  "messages": [
    {
      "id": "msg_001",
      "author": "Ricardo Leite - Seguro Automotivo",
      "content": "Oi! Tudo certo! Gostaria de saber sobre o seguro automotivo",
      "timestamp": "12:23",
      "type": "user_message"
    },
    {
      "id": "msg_002",
      "author": "Assistente",
      "content": "Oi, Rafael! Tudo ótimo e com você? Claro que sim, posso te ajudar com o que precisar. Vi aqui que você já tem uma apólice há 6 meses com o seguro de automóvel, é isso mesmo?",
      "timestamp": "12:23",
      "type": "assistant_message"
    }
  ]
}

Visão 360º
GET /360-view.json

Visão 360º do perfil e histórico do cliente junto à Nortus, incluindo sugestões da IA.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/360-view.json


Resposta:

{
  "client": {
    "name": "Ricardo Leite",
    "clientType": "Cliente Intermediário"
  },
  "produtos": [
    {
      "name": "Seguro automóvel",
      "value": 185.90,
      "status": "Ativo"
    },
    {
      "name": "Seguro Residencial",
      "value": 89.90,
      "status": "Ativo"
    },
    {
      "name": "Seguro Viagem",
      "value": 230.00,
      "status": "Inativo"
    }
  ]
}

Gestão de Tickets
GET /ticket-management.json

Lista de tickets abertos e cards com controle e resumo desses tickets.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/ticket-management.json


Resposta:

{
  "resumo": {
    "open": 15,
    "inProgress": 8,
    "solved": 12,
    "timeAverageHours": 2.5
  },
  "status": ["Aberto", "Em andamento", "Fechado"],
  "priorities": ["Urgente", "Média", "Baixa"],
  "tickets": [
    {
      "id": "TK001",
      "priority": "Urgente",
      "client": "Ricardo Leite",
      "email": "ricardo@email.com",
      "subject": "Solicitação de alteração",
      "status": "Aberto",
      "createdAt": "14/12/2024",
      "responsible": "Ana Silva"
    }
  ]
}

Simulador de Planos
GET /plan.json

Fornece valores, métricas e benefícios dos planos padrão.

URL:

https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2/plan.json


Resposta:

{
  "includedBenefits": [
    "Tudo do básico",
    "Carro reserva",
    "Vidros"
  ],
  "plansIndicators": [
    {
      "name": "Básico",
      "conversion": 75,
      "roi": 80,
      "value": 89.90
    }
  ]
}