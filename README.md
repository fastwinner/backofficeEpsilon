# Back Office Admin - Application Mobile

Application web React pour la gestion administrative de votre plateforme de cours particuliers.

## Fonctionnalités

### 📊 Dashboard
- Statistiques en temps réel (utilisateurs, professeurs, offres, séances)
- Métriques financières (balance globale, bénéfices)
- Graphiques interactifs (évolution mensuelle, statut des offres, revenus)

### 👥 Gestion des Utilisateurs
- Liste complète des utilisateurs avec leurs professeurs associés
- Ajout, modification et suppression d'utilisateurs
- Vue détaillée des relations utilisateur-professeur

### 🎓 Gestion des Professeurs
- Liste des professeurs avec leurs élèves
- CRUD complet (Create, Read, Update, Delete)
- Gestion des matières, tarifs et expérience

### 💳 Historique des Transactions
- Vue complète de toutes les transactions
- Détails des acteurs (élève et professeur)
- Fonctionnalités de remboursement client
- Validation des paiements professeurs
- Statistiques financières

## Technologies Utilisées

- **React 18** - Framework principal
- **Material-UI (MUI)** - Interface utilisateur moderne
- **React Router** - Navigation
- **Recharts** - Graphiques et visualisations
- **DataGrid** - Tableaux de données avancés
- **Date-fns** - Gestion des dates

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez l'application en mode développement :
```bash
npm start
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
src/
├── components/
│   ├── Layout/          # Layout principal avec navigation
│   └── StatCard/        # Composant de carte statistique
├── pages/
│   ├── Dashboard/       # Page tableau de bord
│   ├── Users/          # Gestion des utilisateurs
│   ├── Teachers/       # Gestion des professeurs
│   └── Transactions/   # Historique des transactions
└── App.js              # Configuration principale
```

## Scripts Disponibles

- `npm start` - Lance l'application en mode développement
- `npm build` - Compile l'application pour la production
- `npm test` - Lance les tests
- `npm eject` - Éjecte la configuration (non recommandé)

## Fonctionnalités Détaillées

### Dashboard
- **Cartes statistiques** : Nombre d'utilisateurs, professeurs, offres, séances payées
- **Métriques financières** : Balance globale et bénéfices
- **Graphiques** : Évolution mensuelle, répartition des offres, courbe des revenus

### Gestion Utilisateurs
- **Liste expandable** : Voir les détails et professeurs de chaque utilisateur
- **CRUD complet** : Ajouter, modifier, supprimer des utilisateurs
- **Tableau de données** : Vue tabulaire avec actions rapides

### Gestion Professeurs
- **Informations complètes** : Matière, tarif, expérience, élèves associés
- **Sélection de matières** : Liste prédéfinie des matières disponibles
- **Gestion des tarifs** : Tarif horaire personnalisé

### Transactions
- **Historique complet** : Toutes les transactions avec détails
- **Actions administratives** : Remboursement et validation de paiement
- **Statistiques** : Montants totaux, en attente, remboursés
- **Filtrage** : Par statut, date, montant

## Données de Démonstration

L'application inclut des données de test pour démontrer toutes les fonctionnalités. En production, ces données seraient remplacées par des appels API vers votre backend.

## Personnalisation

L'interface utilise Material-UI avec un thème personnalisable dans `App.js`. Les couleurs, typographies et composants peuvent être facilement modifiés selon vos besoins de marque.
