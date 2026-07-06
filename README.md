# Tracker (React PWA)

Une application web mobile-first de suivi d'entraînements, fonctionnant 100% hors-ligne après chargement (grâce à Firebase IndexedDB persistence et Vite PWA).

## Prérequis

1. Node.js installé (v18+)
2. Un projet Firebase configuré avec Firestore activé.

## Installation

```bash
npm install
```

## Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/).
2. Activez **Firestore Database**.
3. Dans les règles (Rules) de Firestore, pendant le développement, vous pouvez utiliser :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // À sécuriser en production (ex: auth.uid != null)
    }
  }
}
```

4. Dans `src/firebase.ts`, remplacez les valeurs `PLACEHOLDER_*` par les identifiants de votre projet Firebase (Paramètres du projet > Général).

## Lancement (Développement)

```bash
npm run dev
```

L'application sera accessible sur le port 3000 (ou un autre port libre, cf. terminal).

## Déploiement (Firebase Hosting)

L'application est prête à être déployée comme une PWA sur Firebase Hosting.

1. Installez Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Connectez-vous et initialisez le projet :
```bash
firebase login
firebase init hosting
```
- Choisissez votre projet Firebase.
- Dossier public : `dist`
- Réécrire toutes les URL vers `index.html` ? **Oui** (c'est une Single Page App).
- Configurer les déploiements automatiques ? **Non**

3. Build & Deploy :
```bash
npm run build
firebase deploy --only hosting
```

## Architecture technique

- **React 18** (Vite)
- **Firebase Firestore** v9 Modular (avec offline persistence)
- **Vite PWA Plugin** pour l'installation sur mobile (manifest.json + service worker)
- **CSS global** (sans librairie tierce) avec design mobile-first (max-width: 480px).
- **Hooks custom** (`useWorkouts`, `useCompletions`) pour gérer l'abstraction de la base de données.
