const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('./verify-token'); // Ensure this path is correct

// POST - Create a new review
router.post('/games/:id/reviews', verifyToken, (req, res) => {
    const { id } = req.params;
    const { account_id, review_text, rating } = req.body; 

    const sql = 'INSERT INTO user_reviews (game_id, account_id, review_text, rating, review_date) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [id, account_id, review_text, rating], (err, result) => {
        if (err) {
            console.error('Error adding review:', err);
            return res.status(500).send('Error adding review');
        }
        res.status(201).send('Review and rating added successfully');
    });
});

// Retrieve reviews for game
router.get('/games/:id/reviews', (req, res) => {
    const { id } = req.params; 

    const sql = 'SELECT * FROM user_reviews WHERE game_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).send('Error fetching reviews');
        }
        res.json(results);
    });
});


// GET - Retrieve all reviews for a game
router.get('/game/:game_id', (req, res) => {
    const { game_id } = req.params;
    const sql = 'SELECT * FROM reviews WHERE game_id = ?';
    db.query(sql, [game_id], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).send('Error fetching reviews');
        }
        res.json(results);
    });
});

// PUT - Update a review
router.put('/reviews/:id', verifyToken, (req, res) => {
    const { id } = req.params; 
    const { review_text, rating } = req.body; 
    const sql = 'UPDATE user_reviews SET review_text = ?, rating = ?, review_date = NOW() WHERE review_id = ?';
    db.query(sql, [review_text, rating, id], (err) => {
        if (err) {
            console.error('Error updating review:', err);
            return res.status(500).send('Error updating review');
        }
        res.send('Review updated successfully');
    });
});
// DELETE - Delete a review
router.delete('/:review_id', verifyToken, (req, res) => {
    const { review_id } = req.params;
    const sql = 'DELETE FROM reviews WHERE review_id = ?';
    db.query(sql, [review_id], (err) => {
        if (err) {
            console.error('Error deleting review:', err);
            return res.status(500).send('Error deleting review');
        }
        res.send('Review deleted successfully');
    });
});

module.exports = router;
