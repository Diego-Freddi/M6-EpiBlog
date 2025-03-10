const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const {upload} = require("../utils/cloudinary");

//GET
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-Password"); //esclude la password
        res.status(200).json(users);
        console.log("Utenti trovati:", users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST registrazione
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Utente già esistente" });
        }

        const newUser = new User ({ firstName, lastName, email, password }); //crea un nuovo utente (user) utilizzando il modello User.
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Errore durante la registrazione:", error);
        res.status(500).json({ message: error.message });
    }
});

//POST login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utente non trovato" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Password errata" });
        }
        res.status(200).json({ 
            _id: user._id,          // Identificare l'utente per operazioni future
            firstName: user.firstName, // Mostrare il nome nell'interfaccia
            lastName: user.lastName,   // Mostrare il cognome nell'interfaccia
            email: user.email,       // Riferimento per l'utente
            role: user.role,         // Gestire i permessi (Editor/Admin)
            profileImage: user.profileImage
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

//PUT modifica utente
// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { firstName, lastName, email, password } = req.body;

//         // Se la password NON è stata modificata, non la includiamo nell'oggetto da aggiornare
//         if (!password) {
//             delete req.body.password;   // elimina la password dall'oggetto req.body    
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, email, password }, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: "Utente non trovato" });
//         }
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.put("/:id", upload.single('profileImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

        const updateData = { firstName, lastName };
        
        // Se è stata caricata una nuova immagine profilo
        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT modifica password (separata)
router.put("/:id/password", async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Trova l'utente
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        // Verifica la password attuale
        if (user.password !== currentPassword) {
            return res.status(401).json({ message: "Password attuale non corretta" });
        }

        // Aggiorna la password
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ message: "Password aggiornata con successo" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;



