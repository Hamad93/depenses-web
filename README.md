# Depenses Web

Frontend Angular pour l'application de depenses previsionnelles, consommant l'API [depenses-api](https://github.com/Hamad93/depenses-api).

**Production** : https://depenses-web.diallohamad.workers.dev

## Stack technique

- Angular 18 (composants standalone, lazy-loaded par route)
- Angular Material (theme `azure-blue`) + design system custom (variables CSS, cartes, chips, palette de couleurs)
- `HttpClient` pour consommer l'API
- Deploiement Cloudflare Workers (Assets), SPA statique

## Pages

| Route | Composant | Description |
|---|---|---|
| `/` | `DashboardComponent` | Tableau de bord : mois en cours auto-selectionne, resume financier, historique des mois (tri du plus recent au plus ancien) |
| `/months` | `MonthsListComponent` | Gestion des mois (creer / modifier / supprimer, inclure les simulations) |
| `/months/:id` | `MonthDetailComponent` | Detail d'un mois : resume, revenus, depenses (CRUD complet, modal de details) |
| `/stats` | `StatsCompareComponent` | Comparaison de plusieurs mois + evolution |
| `/import` | `ImportPageComponent` | Import d'un fichier Excel `.xlsx` |

## Fonctionnalites notables

- **Mois** : le libelle est genere automatiquement a partir du mois (select "Janvier"..."Decembre") et de l'annee saisie — plus de saisie manuelle de texte libre.
- **Revenus / Depenses** : libelle, categorie et localisation via listes fermees (selects), formulaire depense en deux colonnes, description (textarea), et une **date modifiable** (par defaut aujourd'hui) distincte de la date de creation (immuable, visible dans le modal de details).
- **Modal de details** : bouton "œil" sur chaque ligne revenu/depense pour voir tous les champs (description, date, date de creation...) sans ouvrir le formulaire d'edition.
- **Tableaux** : avatars colores, chips pour le type/categorie/localisation, montants colores (vert/rouge) pour une lecture rapide.

## Demarrage local

```bash
npm install
npm start          # alias de `ng serve`, http://localhost:4200
```

L'API est attendue sur `http://localhost:3000` (voir [depenses-api](https://github.com/Hamad93/depenses-api)) — CORS deja configure cote API pour `localhost:4200`.

## Environnements

Deux fichiers dans `src/environments/`, selectionnes via `fileReplacements` (`angular.json`) :

| Fichier | Utilise par | `apiUrl` |
|---|---|---|
| `environment.development.ts` | `ng serve` / build `development` | `http://localhost:3000` |
| `environment.ts` | `ng build` (production, defaut) | `https://depenses-api.onrender.com` |

## Build

```bash
npm run build              # production -> dist/depenses-web/browser
npx ng build --configuration development
```

## Deploiement (Cloudflare Workers, gratuit)

Le repo contient un `wrangler.jsonc` qui declare un deploiement en **assets statiques** (pas de SSR) avec fallback SPA :

```jsonc
{
  "assets": {
    "directory": "dist/depenses-web/browser",
    "not_found_handling": "single-page-application"
  }
}
```

Sur le dashboard Cloudflare (Workers & Pages → Build) :
- **Build command** : `npm run build`
- **Deploy command** : `npx wrangler deploy` (defaut)

⚠️ Ce fichier `wrangler.jsonc` desactive l'auto-detection "framework Angular" de Cloudflare (qui exige Angular 19+ pour son integration SSR automatique, non applicable ici puisque l'app est un SPA pur) — le champ **Build command** doit donc rester renseigne explicitement dans le dashboard, sinon aucune compilation ne s'execute avant le deploy.

## Qualite

```bash
npx ng build       # verifie aussi le typage et les templates
npm test           # tests unitaires (Karma)
```
