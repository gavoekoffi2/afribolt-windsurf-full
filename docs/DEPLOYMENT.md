# Guide de Déploiement AFRIBOLT

## 🌐 Options de Déploiement

AFRIBOLT peut être déployé de plusieurs manières selon vos besoins :

- **Vercel** (Frontend) + **Render/Railway** (Backend) - Recommandé pour commencer
- **Docker** - Pour contrôle total et scalabilité
- **Cloud Provider** (AWS, GCP, Azure) - Pour entreprises

## 🚀 Option 1: Vercel + Render (Recommandé)

### Frontend sur Vercel

1. **Connecter votre repository GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre repository GitHub
   - Configurez les variables d'environnement

2. **Variables d'environnement Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

3. **Configuration Build**
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Déployer**
   ```bash
   # Depuis le dossier frontend
   vercel --prod
   ```

### Backend sur Render

1. **Créer un compte sur [render.com](https://render.com)**

2. **Créer un Web Service**
   - Connectez votre repository GitHub
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Variables d'environnement Render**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-production-secret
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_AI_API_KEY=...
   ```

4. **Base de données sur Render**
   - Créez une base de données PostgreSQL sur Render
   - Copiez la chaîne de connexion dans les variables d'environnement

5. **Déployer**
   - Push sur GitHub déclenche automatiquement le déploiement

## 🐳 Option 2: Docker Compose

### Préparation

1. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditez .env avec vos valeurs de production
   ```

2. **Build et déploiement**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      GOOGLE_AI_API_KEY: ${GOOGLE_AI_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://your-domain.com
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### Configuration Nginx

Créez `nginx.conf` :

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3001;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## ☁️ Option 3: Cloud Providers

### AWS Deployment

#### Backend sur AWS ECS

1. **Créer un repository ECR**
   ```bash
   aws ecr create-repository --repository-name afribolt-backend
   ```

2. **Build et push Docker image**
   ```bash
   docker build -t afribolt-backend ./backend
   docker tag afribolt-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/afribolt-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/afribolt-backend:latest
   ```

3. **Créer une tâche ECS**
   - Configurez les variables d'environnement
   - Configurez le load balancer
   - Définissez les politiques de scaling

#### Frontend sur AWS S3 + CloudFront

1. **Build et deploy**
   ```bash
   cd frontend
   npm run build
   aws s3 sync ./out s3://your-bucket-name
   ```

2. **Configurer CloudFront**
   - Origin: S3 bucket
   - Cache policy: Optimized
   - SSL certificate: Custom

### Google Cloud Platform

#### Backend sur Cloud Run

1. **Build et deploy**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/PROJECT-ID/afribolt-backend
   gcloud run deploy afribolt-backend --image gcr.io/PROJECT-ID/afribolt-backend --platform managed
   ```

#### Frontend sur Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Deploy**
   ```bash
   cd frontend
   firebase deploy
   ```

## 🔒 Sécurité en Production

### 1. Variables d'Environnement

- Utilisez des secrets forts et uniques
- Ne jamais commiter de clés API
- Utilisez des services de gestion de secrets (AWS Secrets Manager, etc.)

### 2. SSL/TLS

- Forcez HTTPS sur tout le trafic
- Utilisez des certificats valides (Let's Encrypt)
- Configurez HSTS

### 3. Base de Données

- Utilisez des connexions SSL
- Configurez des règles de pare-feu
- Faites des backups réguliers

### 4. Monitoring et Logging

```bash
# Logs de production
docker-compose logs -f backend

# Monitoring avec PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

## 📊 Monitoring et Performance

### 1. Application Monitoring

- **Sentry** pour le tracking d'erreurs
- **LogRocket** pour les sessions utilisateur
- **New Relic** ou **DataDog** pour APM

### 2. Infrastructure Monitoring

- **Prometheus + Grafana** pour métriques
- **Uptime Robot** pour monitoring externe
- **CloudWatch** (AWS) ou **Cloud Monitoring** (GCP)

### 3. Performance Optimization

```bash
# Cache Redis
redis-cli FLUSHALL

# CDN Configuration
# Configurez CloudFlare ou AWS CloudFront

# Database Optimization
# Indexes, connection pooling, read replicas
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnnyhuy/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Checklist Pre-Déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données testée et migrée
- [ ] SSL/TLS configuré
- [ ] Monitoring en place
- [ ] Backup strategy définie
- [ ] Tests de charge effectués
- [ ] Documentation mise à jour
- [ ] Plan de rollback prêt

## 📞 Support Déploiement

Pour toute question sur le déploiement :

- 📧 Email: deploy@afribolt.com
- 💬 Discord: [AFRIBOLT Community](https://discord.gg/afribolt)
- 📖 Docs: [docs.afribolt.com](https://docs.afribolt.com)

---

**Bon déploiement ! 🚀**
