<div align="center">

# STREVO

**Consistency is your edge.**

Registre treinos, mantenha o streak e transforme cada sessão em um story.

<br />

[![Demo](https://img.shields.io/badge/demo-online-00F5A0?style=for-the-badge&logo=githubpages&logoColor=black)](https://joaogalimberti.github.io/strevo/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br />

[**Ver demo**](https://joaogalimberti.github.io/strevo/) · [Início rápido](#-início-rápido) · [Funcionalidades](#-funcionalidades) · [Deploy](#-deploy)

</div>

<br />

## ◆ Sobre

STREVO é um app de alta performance para registro de treinos e consistência física, com estética **dark-mode futurista**, estatísticas gamificadas e geração de stories para redes sociais.

A versão web é **100% client-side**, responsiva e pensada para portfólio: no desktop, roda dentro de um shell realista de iPhone; no celular, ocupa a tela inteira. Sem banco, sem servidor.

<br />

## ◆ Início rápido

```bash
npm run dev
```

Abra **http://localhost:5173** e use o **demo mode** para entrar com 1 clique.

<br />

## ◆ Funcionalidades

| | Recurso | O que entrega |
|:-:|---|---|
| 🏠 | **Dashboard** | Streak animado com anel de consistência, progresso semanal (Seg–Dom), última sessão e frases motivacionais |
| ⏱️ | **Sessão ativa** | Timer de alta precisão com anel de pulso em SVG, calorias estimadas, ritmo e frases de foco |
| ✅ | **Registro de treino** | Categorias (Gym, Running, Cycling, Yoga, HIIT, Calistenia), grupos musculares, intensidade com cálculo de calorias, foto e anotações |
| 🎨 | **Story Generator** | Canvas **1080×1920 (9:16)** com 4 temas, foto, dados do treino, streak e @username. Download em PNG e compartilhamento nativo |
| 📅 | **Calendário** | Navegação por mês, dias treinados com glow neon, modal de detalhes e histórico cronológico |
| 👤 | **Perfil** | Nível do atleta com barra de XP, conquistas e badges, métricas totais e troca de conta |
| 🔐 | **Auth & Onboarding** | Login, registro e demo instantâneo |

<details>
<summary><b>Temas do Story Generator</b></summary>

<br />

| Tema | Estilo |
|---|---|
| **Neon Cyber** | Contraste alto, brilho neon |
| **Obsidian Minimal** | Escuro e limpo |
| **Solar Flame** | Tons quentes e energéticos |
| **Clean White** | Claro e editorial |

</details>

<br />

## ◆ Estrutura

```
strevo/
├── frontend/    React + TypeScript + Vite   → web app (portfólio)
├── backend/     NestJS + Prisma             → API (SQLite / PostgreSQL)
├── mobile/      React Native + Expo         → app nativo
└── package.json                             → scripts orquestradores
```

<br />

## ◆ Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o frontend na porta `5173` |
| `npm run build` | Gera o build de produção em `frontend/dist` |
| `npm run deploy` | Publica o build na branch `gh-pages` |
| `npm run dev:backend` | Inicia a API NestJS em modo dev |
| `npm run dev:mobile` | Inicia o app mobile com Expo |

<br />

