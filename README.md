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
- Commande via téléphone ou WhatsApp (récap pré-rempli)
- Avis clients (curation statique)
- Contact, horaires, carte Google Maps embed

## Remplacer les images

Les visuels actuels sont des photos stock (Unsplash). Remplacez les URLs dans `src/data/menu.ts` (`IMG`) ou placez vos fichiers dans `public/images/`.

## Avis Google (mise à jour auto)

Les avis sont récupérés via `/api/reviews` (cache 1 h) :
1. **Google Places API** si `GOOGLE_MAPS_API_KEY` est défini (voir `.env.example`)
2. Sinon : note + volume via agrégateur Rankeat + textes d’avis publics

Le carrousel affiche les avis récupérés et le total réel (ex. 246), avec lien « Voir tous les avis sur Google ».
