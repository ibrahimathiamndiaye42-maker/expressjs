const express = require('express');
const cors = require('cors'); // Installé via: npm install cors

const app = express();

// --- CONFIGURATION ---
app.use(cors()); // Autorise le Front-end à communiquer avec le Back-end
app.use(express.json()); // Permet de lire le corps des requêtes JSON

// Base de données temporaire
let taches = [];
let idAuto = 1;

// --- ROUTES ---

// Lister les tâches
app.get('/taches', (req, res) => {
    res.json(taches);
});

// Ajouter une tâche
app.post('/taches', (req, res) => {
    const { nom, description, statut } = req.body;

    // Validation
    if (!nom || !description || !statut) {
        return res.status(400).json({ message: "Champs manquants" });
    }
    if (statut !== "en cours" && statut !== "termine") {
        return res.status(400).json({ message: "Statut invalide" });
    }

    const tache = { id: idAuto++, nom, description, statut };
    taches.push(tache);
    res.status(201).json(tache); // 201 = Created
});

// Modifier une tâche
app.put('/taches/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nom, description, statut } = req.body;

    const tache = taches.find(t => t.id === id);
    if (!tache) {
        return res.status(404).json({ message: "Tâche introuvable" });
    }

    if (nom) tache.nom = nom;
    if (description) tache.description = description;
    if (statut) {
        if (statut !== "en cours" && statut !== "termine") {
            return res.status(400).json({ message: "Statut invalide" });
        }
        tache.statut = statut;
    }

    res.json(tache);
});

// Supprimer une tâche
app.delete('/taches/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = taches.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Tâche introuvable" });
    }

    taches.splice(index, 1);
    res.json({ message: "Tâche supprimée" });
});

// --- LANCEMENT ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});