# Vitrine d'artiste

Ce projet est une **application React** réalisée avec **Vite** qui sert de site vitrine pour une artiste. Il permet :

- d'afficher une **galerie d'œuvres**,
- d'**ajouter, modifier et supprimer des œuvres**,
- de présenter l'artiste sur une page dédiée,
- d'afficher les **expositions à venir**,
- de proposer des **liens externes** vers Instagram et Etsy,
- de gérer les contenus via une interface sécurisée.

L'application utilise **Supabase** comme backend pour la gestion des données et des fichiers. Elle est conçue pour être déployée sur **GitHub Pages**.

---

## Fonctionnalités principales

### 1. Galerie d'œuvres
- Affiche toutes les œuvres disponibles sous forme de cartes.
- Chaque carte contient une image, un titre et une description.

### 2. Gestion des œuvres
- Ajout d'une nouvelle œuvre avec un titre, une description et une image.
- Modification et suppression des œuvres existantes.

### 3. Page "À propos"
- Présente une description de l'artiste, une photo et des liens vers ses réseaux sociaux (Instagram, Etsy).

### 4. Gestion des expositions
- Ajout, modification et suppression des expositions.
- Affichage des expositions à venir avec leurs dates, lieux et descriptions.

### 5. Authentification
- Une interface de connexion permet de sécuriser l'accès aux pages de gestion des contenus.

---

## Architecture et organisation

Le code est organisé selon des principes de séparation des responsabilités :

| Dossier/Fichier         | Description courte                                                                 |
|-------------------------|-----------------------------------------------------------------------------------|
| `src/components`        | Composants réutilisables : barre de navigation (`Navbar.jsx`), carte d'œuvre (`ArtworkCard.jsx`), etc. |
| `src/context`           | Contexte React (`ArtworkContext.jsx`) pour gérer les œuvres et leur état global.  |
| `src/pages`             | Pages principales de l'application : accueil (`Home.jsx`), gestion (`Modifier.jsx`), etc. |
| `src/services`          | Services pour interagir avec Supabase (`supabaseService.js`).                     |
| `src/style.css`         | Feuille de styles globale utilisant des variables CSS pour une personnalisation facile. |
| `.github/workflows`     | Contient un workflow GitHub Actions pour le déploiement automatique sur GitHub Pages. |
| `vite.config.js`        | Configuration Vite : la propriété `base` doit pointer vers votre sous-répertoire GitHub Pages. |
| `package.json`          | Dépendances, scripts et paramètre `homepage` utilisé par `gh-pages`.             |

---

## Installation locale

### Prérequis
- **Node.js** (version LTS recommandée)
- **npm**

### Étapes
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/<utilisateur>/Showcase.git
   cd Showcase
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible à l'adresse `http://localhost:5173`.

---

## Déploiement

### 1. Déploiement manuel avec `gh-pages`
1. Configurez la clé `homepage` dans `package.json` avec l’URL complète de votre site (par exemple `"https://utilisateur.github.io/Showcase/"`).
2. Exécutez les commandes suivantes :
   ```bash
   npm run build
   npm run deploy
   ```
   Cela génère le dossier `dist` et le publie sur la branche `gh-pages`.

### 2. Déploiement automatique via GitHub Actions
Un workflow est déjà configuré dans `.github/workflows/deploy.yml`. À chaque push sur la branche `main`, le site est automatiquement déployé sur GitHub Pages.

---

## Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com/).
2. Configurez les tables suivantes :
   - **about** : pour les informations sur l'artiste.
   - **artworks** : pour les œuvres.
   - **exhibitions** : pour les expositions.
3. Ajoutez les variables d'environnement dans un fichier `.env` :
   ```env
   VITE_SUPABASE_URL=Votre_URL_Supabase
   VITE_SUPABASE_KEY=Votre_clé_Supabase
   VITE_ID=Votre_identifiant
   VITE_MDP=Votre_mot_de_passe
   ```

---

## Personnalisation

- **Nom et biographie de l'artiste** : modifiez le titre du site dans `Navbar.jsx` et la page `About.jsx`.
- **Liens externes** : mettez à jour les URL Instagram et Etsy dans la table `about` de Supabase.
- **Styles** : adaptez les couleurs et la mise en page en modifiant les variables CSS dans `src/style.css`.

---

## Bonnes pratiques

- **Sécurisez vos clés Supabase** : ne les exposez pas publiquement.
- **Testez avant de déployer** : utilisez `npm run preview` pour vérifier le site en production localement.
- **Mettez à jour la documentation** : assurez-vous que le fichier `README.md` reflète les dernières modifications du projet.

---


Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir une issue sur le dépôt
