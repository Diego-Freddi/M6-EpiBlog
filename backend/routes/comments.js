const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();

//GET tutti i commenti  
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("author", "firstName lastName profileImage")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST crea un nuovo commento   
router.post("/", async (req, res) => {

    try {
        const { content, author, post } = req.body;
        const newComment = new Comment({ content, author, post });
        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate("author", "firstName lastName");
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE cancella un commento
router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Commento non trovato" });
        }
        res.status(200).json({ message: "Commento eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;