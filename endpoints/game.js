const express = require('express');
const router = express.Router();
const db = require('../database'); 

// GET - Retrieve all games
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM game';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching games:', err);
            return res.status(500).send('Error fetching games');
        }
        res.json(results);
    });
});

// GET - Retrieve a single game by ID
router.get('/games/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT game.*, GROUP_CONCAT(genre.name) AS genres
                 FROM game
                 JOIN game_genre ON game.game_id = game_genre.game_id
                 JOIN genre ON game_genre.genre_id = genre.genre_id
                 WHERE game.game_id = ?
                 GROUP BY game.game_id`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching game details:', err);
            return res.status(500).send('Error fetching game details');
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send('Game not found');
        }
    });
});

module.exports = router;
