# AFRIBOLT - Plateforme AI Multi-Agents

🚀 **Alternative africaine premium à MGX, Cursor, Bolt, Lovable**

AFRIBOLT est une plateforme SaaS AI multi-agents révolutionnaire qui permet de développer, déployer et scaler des projets logiciels grâce à 7 agents IA spécialisés collaboratifs.

## 🌟 Fonctionnalités Principales

### 🤖 Agents IA Spécialisés
- **EMEFA** - Team Lead AI (Manager Général)
- **KOFFI** - Architecte & Stratégie Technique  
- **DÉDÉ** - Backend & Infrastructure
- **SOLIM** - UX / UI Designer
- **AKOFA** - Frontend Builder
- **KWAMI** - Documentation & Knowledge AI
- **YAOVI** - Dev Collaboration Agent

### 🔧 Multi-LLM Router
- OpenAI GPT-4 / GPT-3.5
- Anthropic Claude Sonnet / Opus
- Google Gemini Pro
- Sélection dynamique du meilleur modèle

### 🏗️ Architecture Moderne
- **Backend**: Node.js + TypeScript + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + React + TailwindCSS
- **Real-time**: Socket.io pour collaboration instantanée
- **Sécurité**: JWT + OAuth 2.0 + RGPD compliant

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+
- Redis (optionnel pour le cache)
- Clés API pour les services LLM

## 🚀 Installation Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/afribolt/afribolt.git
cd afribolt
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

### 3. Frontend  
```bash
cd frontend
npm install
cp .env.example .env.local
# Configurer NEXT_PUBLIC_API_URL
npm run dev
```

### 4. Base de données
```bash
# Depuis le dossier backend
npx prisma migrate dev
npx prisma db seed
```

## ⚙️ Configuration

### Variables d'environnement (Backend)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/afribolt"
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### Variables d'environnement (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏁 Démarrage

1. **Démarrer PostgreSQL**
2. **Démarrer le backend** : `npm run dev` (port 3001)
3. **Démarrer le frontend** : `npm run dev` (port 3000)
4. **Accéder à l'application** : http://localhost:3000

## 📊 Architecture du Projet

```
afribolt/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── agents/         # Agents IA spécialisés
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── middleware/     # Middleware (auth, validation)
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Services métier
│   │   ├── llm/           # Multi-LLM Router
│   │   └── utils/         # Utilitaires
│   ├── prisma/            # Schéma de base de données
│   └── package.json
├── frontend/               # Application Next.js 14
│   ├── app/              # App Router Next.js 14
│   ├── components/       # Composants React
│   │   ├── landing/      # Page d'accueil
│   │   ├── dashboard/    # Dashboard utilisateur
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilitaires frontend
│   └── package.json
├── docs/                 # Documentation
└── README.md
```

## 🔌 API Documentation

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion  
- `POST /api/auth/google` - OAuth Google
- `GET /api/auth/me` - Profil utilisateur

### Projets
- `GET /api/projects` - Lister les projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/:id` - Détails projet
- `PUT /api/projects/:id` - Modifier projet
- `DELETE /api/projects/:id` - Supprimer projet

### Agents
- `GET /api/agents` - Lister les agents
- `POST /api/agents/chat` - Discuter avec un agent
- `GET /api/agents/:id` - Détails agent

### LLM
- `GET /api/llm/models` - Modèles disponibles
- `POST /api/llm/test` - Tester un modèle

## 🚀 Déploiement

### Vercel (Frontend)
```bash
# Depuis le dossier frontend
npm run build
vercel --prod
```

### Render/Railway (Backend)
```bash
# Depuis le dossier backend
npm run build
# Déployer sur Render/Railway avec les variables d'environnement
```

### Docker
```bash
# Build
docker-compose build

# Run
docker-compose up -d
```

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous license MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Inspiration de [MGX](https://mgx.dev/)
- Intégration de [DeepCode](https://github.com/HKUDS/DeepCode)
- Prompts inspirés de [system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)

## 📧 Contact

- Email: contact@afribolt.com
- Twitter: [@afribolt](https://twitter.com/afribolt)
- Website: [afribolt.com](https://afribolt.com)

---

**Made with ❤️ in Africa, for the world**
