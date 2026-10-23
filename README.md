# Snack Medya

Site vitrine bilingue (FR/EN) pour Snack Medya — kebab & snack à Neufchâteau.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- next-intl (FR/EN)
- Zustand (configurateur)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) (redirige vers `/fr`).

## Scripts

- `npm run dev` — développement
- `npm run build` — build production
- `npm start` — serveur production

## Fonctionnalités

- Hero kebab + catalogue officiel fidèle aux menus papier
- Configurateur multi-étapes avec prix en temps réel
- Commande par téléphone ou sur Uber Eats
- Avis clients (curation statique)
- Contact, horaires, carte Google Maps embed

## Remplacer les images

Les visuels actuels sont des photos stock (Unsplash). Remplacez les URLs dans `src/data/menu.ts` (`IMG`) ou placez vos fichiers dans `public/images/`.

## Avis Google (mise à jour auto)

Les avis sont récupérés via `/api/reviews` (cache 1 h) — **la route est conservée** pour un hébergement serveur :
1. **Google Places API** si `GOOGLE_MAPS_API_KEY` est défini (voir `.env.example`)
2. Sinon : note + volume via agrégateur Rankeat + textes d’avis publics

Sur GitHub Pages (export statique temporaire), les avis sont figés au moment du build ; le client garde le fallback SSR si `/api/reviews` est indisponible.

## Déploiement GitHub Pages (temporaire)

Workflow : `.github/workflows/deploy-pages.yml`

1. Repo → **Settings → Pages → Source: GitHub Actions**
2. Push sur `main` (ou lancer le workflow manuellement)
3. Site : https://jason54jg.github.io/snack-medya/

`npm run build:pages` génère `out/` en local.  
La route `src/app/api/reviews` **n’est pas supprimée** : elle est seulement mise de côté pendant l’export statique, puis restaurée. Sur un hébergement Node (Vercel, etc.) elle fonctionne normalement.

## Docker (VPS)

Serveur Next.js complet : `/api/reviews` et la redirection `/` → `/fr` fonctionnent, contrairement à GitHub Pages.

```bash
docker compose up -d --build
```

Site sur [http://localhost:3000](http://localhost:3000) (port modifiable via `PORT=8080 docker compose up -d`).

- Clé Google Places optionnelle : `GOOGLE_MAPS_API_KEY=... docker compose up -d` (ou dans un fichier `.env` à côté de `docker-compose.yml`)
- Image ~280 Mo, ~40 Mo de RAM au repos, limitée à 384 Mo ; logs plafonnés à 30 Mo
- Le build (`next build`) consomme ~1 Go de RAM : sur un VPS 2 Go, éviter de builder pendant un autre gros process
