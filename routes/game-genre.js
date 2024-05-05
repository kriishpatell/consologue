const express = require('express');
const router = express.Router();
const db = require('../database'); // Adjust the path as necessary
const verifyToken = require('./verify-token'); // Ensure this path is correct

router.post('/games/:gameId/genres/:genreId', verifyToken, isAdmin, (req, res) => {
    const { gameId, genreId } = req.params;
    const sql = 'INSERT INTO game_genre (game_id, genre_id) VALUES (?, ?)';
    db.query(sql, [gameId, genreId], (err) => {
        if (err) {
            console.error('Error linking genre to game:', err);
            return res.status(500).send('Error linking genre to game');
        }
        res.status(201).send('Genre linked to game successfully');
    });
});

router.delete('/games/:gameId/genres/:genreId', verifyToken, isAdmin, (req, res) => {
    const { gameId, genreId } = req.params;
    const sql = 'DELETE FROM game_genre WHERE game_id = ? AND genre_id = ?';
    db.query(sql, [gameId, genreId], (err) => {
        if (err) {
            console.error('Error unlinking genre from game:', err);
            return res.status(500).send('Error unlinking genre from game');
        }
        res.send('Genre unlinked from game successfully');
    });
});
