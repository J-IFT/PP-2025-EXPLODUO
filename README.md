# 💣 Exploduo

**Exploduo** est un jeu web multijoueur inspiré du célèbre *Démineur*, conçu pour être joué à **deux joueurs en simultané**.  
Le but : coopérer ou se défier sur une même grille, révéler un maximum de cases sans tomber sur une mine… et exploser de rire (ou de rage) !

---

## 🎮 Fonctionnalités

- 🧩 **Grille partagée** : les deux joueurs jouent sur la même grille, en temps réel.
- 👥 **Multijoueur à 2** : partie entre deux joueurs connectés via un code ou un lien unique.
- ⚡ **Révélation synchronisée** : quand un joueur clique, l’autre voit instantanément les changements.
- 💥 **Mine = fin de partie** : si un joueur clique sur une mine, c’est perdu pour les deux.
- 🏆 **Score en temps réel** : chaque case sûre révélée donne 1 point au joueur.
- 📊 **Tableau des scores** : visible pendant la partie pour suivre la progression.
- 🔗 **Lobby/join facile** : créer ou rejoindre une partie via un lien unique.

---

## 🚀 Technologies utilisées

> ⚠️ Les technologies exactes peuvent varier selon la génération (ex : Bolt, Vercel, etc.)

- **Frontend** : React, Next.js ou autre framework moderne
- **Backend** : WebSocket (Socket.IO, ou équivalent) ou REST API
- **Temps réel** : gestion des états partagés via Socket.io ou similar
- **Déploiement** : 
  - Frontend → [Vercel](https://vercel.com)
  - Backend → Railway / Render / Supabase / autre (selon le setup)

---

## 📦 Installation

```bash
# 1. Clone le dépôt
git clone https://github.com/ton-pseudo/exploduo.git
cd exploduo

# 2. Installe les dépendances
npm install

# 3. Lance le serveur de développement
npm run dev
