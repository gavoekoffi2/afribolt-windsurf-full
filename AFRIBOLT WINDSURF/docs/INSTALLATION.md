# Guide d'Installation AFRIBOLT

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18.0 ou supérieur
- **PostgreSQL** 14.0 ou supérieur  
- **Redis** (optionnel, pour le cache)
- **Git** pour cloner le repository

## 🚀 Installation Complete

### 1. Cloner le Repository

```bash
git clone https://github.com/afribolt/afribolt.git
cd afribolt
```

### 2. Installation Backend

```bash
cd backend
npm install
```

#### Configuration des variables d'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos configurations :

```env
# Configuration de base
NODE_ENV=development
PORT=3001

# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/afribolt"

# Sécurité
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Clés API LLM (requises pour les agents IA)
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Configuration Redis (optionnel)
REDIS_URL=redis://localhost:6379
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

#### Configuration des variables d'environnement

```bash
cp .env.example .env.local
```

Éditez le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Configuration Base de Données

#### Créer la base de données PostgreSQL

```sql
CREATE DATABASE afribolt;
CREATE USER afribolt WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE afribolt TO afribolt;
```

#### Lancer les migrations Prisma

```bash
cd ../backend
npx prisma migrate dev
npx prisma generate
```

#### Peupler la base de données (optionnel)

```bash
npx prisma db seed
```

### 5. Démarrer les Services

#### Option A: Manuellement

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**  
```bash
cd frontend
npm run dev
```

#### Option B: Avec Docker

```bash
# Depuis la racine du projet
docker-compose up -d
```

### 6. Accéder à l'Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs

## 🔧 Vérification de l'Installation

### 1. Vérifier le Backend

```bash
curl http://localhost:3001/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Vérifier les Models LLM

```bash
curl http://localhost:3001/api/llm/models
```

### 3. Créer un compte utilisateur

Visitez http://localhost:3000/auth/register pour créer votre premier compte.

## 🐛 Dépannage

### Problèmes Communs

#### 1. Erreur de connexion à la base de données

**Symptôme**: `Error: P1001: Can't reach database server`

**Solution**: 
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez la chaîne de connexion dans `.env`
- Assurez-vous que la base de données `afribolt` existe

#### 2. Clés API manquantes

**Symptôme**: Les agents IA ne répondent pas

**Solution**:
- Ajoutez vos clés API OpenAI, Anthropic et Google AI dans `.env`
- Redémarrez le backend après modification

#### 3. Port déjà utilisé

**Symptôme**: `Error: listen EADDRINUSE :::3001`

**Solution**:
- Changez le port dans `.env` ou arrêtez le processus utilisant le port
- Utilisez `lsof -i :3001` pour identifier le processus

#### 4. Erreur de dépendances

**Symptôme**: Erreur npm lors de l'installation

**Solution**:
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Logs et Debugging

#### Logs Backend
Les logs sont disponibles dans `backend/logs/` :
- `combined.log` - Tous les logs
- `error.log` - Erreurs uniquement

#### Mode Développement
Activez le mode debug en ajoutant `DEBUG=afribolt:*` avant les commandes :

```bash
DEBUG=afribolt:* npm run dev
```

## 🚀 Déploiement en Production

Pour un déploiement en production, consultez le guide [DEPLOYMENT.md](DEPLOYMENT.md).

### Points importants pour la production :

1. **Sécurité** :
   - Changez tous les secrets par défaut
   - Utilisez HTTPS
   - Configurez CORS correctement

2. **Performance** :
   - Activez Redis pour le cache
   - Utilisez un CDN pour les assets
   - Configurez le load balancing

3. **Monitoring** :
   - Configurez les logs de production
   - Mettez en place un monitoring de performance
   - Configurez les alertes

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez la [FAQ](FAQ.md)
2. Vérifiez les [issues GitHub](https://github.com/afribolt/afribolt/issues)
3. Contactez-nous à support@afribolt.com

---

**Bon développement avec AFRIBOLT ! 🚀**
