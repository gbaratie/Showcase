# Vitrine d'artiste

Ce projet est une **application React** réalisée avec **Vite** qui sert de site vitrine pour une artiste. Il permet :

- d'afficher une **galerie d'œuvres**,
- d'**ajouter une nouvelle œuvre** en fournissant un nom, une description et, si souhaité, une image,
- de présenter l'artiste sur une page dédiée,
- de proposer des **liens externes** vers Instagram et Etsy.

L'application est entièrement front‑end et stocke les œuvres dans le _localStorage_ du navigateur. Aucune base de données ni serveur n'est nécessaire ; ce site est donc parfait pour un hébergement statique comme **GitHub Pages**.

## Architecture et organisation

Le code est organisé de manière claire selon des principes de séparation des responsabilités :

| Élément             | Description courte                                                  |
|--------------------|---------------------------------------------------------------------|
| `src/components`    | Composants réutilisables : barre de navigation (`Navbar.jsx`) et carte d'œuvre (`ArtworkCard.jsx`). |
| `src/context`       | Le contexte React (`ArtworkContext.jsx`) gère la liste des œuvres et leur persistance dans le navigateur. |
| `src/pages`         | Pages de l'application : accueil (`Home.jsx`), ajout d'œuvre (`AddArtwork.jsx`) et présentation de l'artiste (`About.jsx`). |
| `src/style.css`     | Feuille de styles globale utilisant des variables CSS pour la palette de couleurs. |
| `.github/workflows` | Contient un workflow GitHub Actions pour le déploiement automatique sur GitHub Pages. |
| `vite.config.js`    | Configuration Vite : la propriété `base` doit pointer vers votre sous‑répertoire GitHub Pages【296814488797800†L233-L246】. |
| `package.json`      | Dépendances, scripts et paramètre `homepage` utilisé par `gh-pages`. |

### Fonctionnement interne

1. **Contexte d'œuvres** : Les œuvres sont stockées dans un tableau maintenu par `ArtworkContext`. Ce contexte est chargé au démarrage depuis le _localStorage_ (ou initialisé à vide) et sauvegardé à chaque modification. Chaque œuvre contient un identifiant, un titre, une description et, si vous en fournissez une, une image encodée en DataURL.
2. **Pages** : Les routes sont définies dans `App.jsx` à l'aide de `react-router-dom`. Le chemin `/` affiche la galerie, `/ajouter` propose un formulaire pour créer une nouvelle œuvre et `/a-propos` décrit l'artiste.
3. **Persistance sans serveur** : Comme le site est statique, les œuvres ajoutées ne sont pas partagées entre utilisateurs. Elles sont conservées localement dans le navigateur qui les ajoute. Pour préremplir des œuvres, modifiez le tableau initial dans `ArtworkContext.jsx` ou fournissez un JSON.

## Installation locale

Assurez‑vous d’avoir **Node.js** (version LTS recommandée) et **npm** installés. Puis dans ce dossier :

```bash
npm install        # installe les dépendances
npm run dev        # lance l'application en mode développement (http://localhost:5173)
```

## Construction et prévisualisation

Pour générer la version de production et la visualiser localement :

```bash
npm run build      # génère le dossier dist
npm run preview    # sert le dossier dist sur un serveur local
```

## Déploiement sur GitHub Pages

### Configurer la base

Lorsque vous déployez un site Vite sous un sous‑répertoire (par exemple `https://utilisateur.github.io/mon‑depot/`), la propriété `base` de `vite.config.js` doit correspondre à ce chemin. La documentation officielle de Vite indique de définir `base` à `'/mon‑depot/'`【296814488797800†L233-L246】. Dans ce projet, la valeur par défaut est `'/artiste-vitrine/'`. Modifiez‑la si vous renommez votre dépôt ou si vous déployez à la racine (`'/'`).

### Méthode 1 : utilisation du package `gh-pages`

1. Mettez à jour la clé `homepage` dans `package.json` avec l’URL complète de votre site (par exemple `"https://utilisateur.github.io/artiste-vitrine/"`).
2. Installez `gh-pages` et ajoutez les scripts `predeploy` et `deploy` dans `package.json` comme indiqué dans les guides【779613005636906†L60-L88】. Ces scripts sont déjà présents dans ce projet.
3. Exécutez :

   ```bash
   npm run deploy
   ```

   Le script lance `npm run build` puis publie le dossier `dist` sur la branche `gh-pages` de votre dépôt. Une fois la publication terminée, rendez‑vous dans l’onglet **Settings > Pages** de votre dépôt et sélectionnez la source `gh-pages` si cela n’est pas fait automatiquement【779613005636906†L60-L88】. Après quelques minutes, votre site sera accessible.

### Méthode 2 : déploiement automatique via GitHub Actions

Un workflow se trouve dans `.github/workflows/deploy.yml`. Il suit la recommandation de Vite : lors d’un push sur la branche `main`, GitHub Actions installe les dépendances, exécute `npm run build` et publie le dossier `dist` sur GitHub Pages【296814488797800†L233-L246】. Vous n’avez alors pas besoin d’exécuter manuellement `npm run deploy`. Vérifiez simplement que votre dépôt active **GitHub Pages** avec la source **GitHub Actions**.

## Personnalisation

- **Nom et biographie de l'artiste** : modifiez le titre du site dans `Navbar.jsx` et la page `About.jsx` pour y insérer votre biographie et vos photos.
- **Liens externes** : dans `Home.jsx`, remplacez les valeurs `https://www.instagram.com/votre_profil_instagram` et `https://www.etsy.com/fr/shop/votre_boutique_etsy` par vos véritables liens.
- **Styles** : adaptez les couleurs et la mise en page en modifiant les variables CSS dans `src/style.css`.

## Bonnes pratiques de développement

La structure de ce projet repose sur des concepts éprouvés : séparation des composants, utilisation d'un contexte pour gérer l'état global, et commentaires expliquant chaque partie du code. Lors du déploiement sur GitHub Pages, pensez à :

* Définir correctement la propriété `base` dans `vite.config.js` pour que les chemins relatifs fonctionnent【296814488797800†L233-L246】.
* Ajouter un `homepage` et des scripts `predeploy`/`deploy` si vous utilisez `gh-pages`【779613005636906†L60-L88】.
* Utiliser `BrowserRouter` avec `basename={import.meta.env.BASE_URL}` afin que React Router connaisse le sous‑répertoire et évite les erreurs 404.

N'hésitez pas à adapter cette architecture à vos besoins (découper davantage les composants, intégrer une API ou un CMS headless, ajouter des tests, etc.).
