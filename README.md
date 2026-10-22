# STREVO — Consistency is Your Edge 🔥

STREVO é um aplicativo de alta performance e motivação para registro de treinos e consistência física. Projetado com estética dark-mode futurista, storytelling dinâmico, estatísticas gamificadas e geração de stories para redes sociais.

O repositório conta agora com uma **versão Web completa e responsiva** (pensada em mobile com shell de celular realista para desktop), ideal para **apresentação em portfólio**, rodando 100% no navegador sem dependência obrigatória de banco ou servidor externo.

---

## ⚡ Inicialização Rápida (Recomendado para Portfólio)

Na raiz do projeto, basta rodar:

```bash
npm run dev
```

Abra no navegador em: **`http://localhost:5173`**

---

## 📱 Estrutura do Projeto

```
strevo/
├── frontend/        # Web App em React + TypeScript + Vite (Portfolio Ready)
├── backend/         # API em NestJS + Prisma ORM (SQLite / PostgreSQL)
├── mobile/          # App Nativo em React Native com Expo
└── package.json     # Orquestrador com scripts simplificados
```

---

## ✨ Funcionalidades do Frontend Web

- **📱 Phone Shell Realista**: Em telas de desktop, simula um iPhone com dynamic notch e status bar em tempo real. Em dispositivos móveis, ocupa a tela inteira com máxima imersão.
- **🔐 Auth & Onboarding**: Login e Registro com animações, demo mode instantâneo (com 1 clique) e métricas globais de preview.
- **🏠 Dynamic Dashboard**:
  - Streak contador animado com anel de consistência.
  - Tracker de progresso semanal (Seg a Dom) com indicadores de dias concluídos.
  - Card de última sessão com detalhes de categoria e tempo.
  - Frases motivacionais rotativas.
  - Estatísticas de resumo rápido.
- **⏱️ Active Workout Session**:
  - Timer de alta precisão com anel de pulso svg.
  - Frases de foco e mentalidade de treino a cada intervalo.
  - Contador de minutos, calorias estimadas e ritmo.
- **✅ Finish & Log Workout**:
  - Seleção por categoria esportiva (Gym, Running, Cycling, Yoga, HIIT, Calistenia).
  - Subcategorias de grupos musculares (Chest, Back, Legs, Shoulders, Arms, etc.).
  - Seletor de intensidade com cálculo dinâmico de calorias.
  - Upload de foto pessoal ou escolha de fotos fitness predefinidas de alta qualidade.
  - Campo de anotações do atleta.
- **🎨 HTML5 Canvas 1080x1920 Story Generator**:
  - Renderizador em canvas de stories em alta resolução (9:16 - 1080x1920) direto no navegador!
  - 4 temas visuais: *Neon Cyber*, *Obsidian Minimal*, *Solar Flame* e *Clean White*.
  - Composição com a foto do usuário, dados do treino, dia do streak e @username.
  - **Download 1-Clique em PNG** de alta resolução e suporte a compartilhamento nativo.
- **📅 Interactive Calendar & History**:
  - Navegação entre meses com grid interativo.
  - Dias com treino destacados com glow neon.
  - Modal com detalhamento completo da sessão, calorias e anotações.
  - Histórico cronológico de atividades.
- **👤 Athlete Profile & Gamification**:
  - Nível do Atleta (Lv. XP) com barra de progressão de tier.
  - Sistema de Conquistas e Badges desbloqueáveis (*7-Day Warrior*, *Iron Discipline*, etc.).
  - Resumo de métricas totais (Workouts, Horas treinadas, Total de calorias).
  - Logout e alternância de contas.

---

## 🛠 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o Frontend Web na porta 5173 |
| `npm run build` | Compila o build de produção em `frontend/dist` |
| `npm run deploy` | Publica o build diretamente no GitHub Pages via branch `gh-pages` |
| `npm run dev:backend` | Inicia a API NestJS em modo de desenvolvimento |
| `npm run dev:mobile` | Inicia o app mobile Expo |

---

## 🌐 Como Colocar no Ar (GitHub Pages / Vercel / Netlify)

### 1. GitHub Pages (100% Automático via GitHub Actions — Recomendado)
O repositório já inclui o workflow `.github/workflows/deploy.yml`:
1. Suba as alterações para o GitHub:
   ```bash
   git add .
   git commit -m "feat: configure github pages deployment"
   git push origin main
   ```
2. No seu repositório no GitHub, acerte a configuração de Pages:
   - Acesse **Settings** > **Pages**
   - Em **Build and deployment > Source**, selecione: **GitHub Actions**
3. O GitHub compilará automaticamente a pasta `frontend` e publicará o site em:
   **`https://joaogalimberti.github.io/strevo/`**

### 2. GitHub Pages (Alternativa via comando `npm run deploy`)
Se preferir usar a branch `gh-pages`:
```bash
npm run deploy
```
E em **Settings** > **Pages**, selecione a branch `gh-pages` e pasta `/ (root)`.

### 3. Vercel ou Netlify
1. Conecte o repositório.
2. Defina **Root Directory**: `frontend`.
3. O build (`npm run build`) e output (`dist`) já estão configurados.

---

Feito com dedicação para o ecossistema **STREVO**.
