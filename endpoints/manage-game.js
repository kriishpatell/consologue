const express = require('express');
const router = express.Router();
const db = require('../database'); // Adjust the path as necessary
const verifyToken = require('./verify-token'); // Ensure this path is correct

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const userId = req.user.id; // Assuming the user ID is stored in req.user when decoded from JWT
    const sql = 'SELECT account_type FROM account WHERE account_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error checking user role:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.length > 0 && results[0].account_type === 'admin') {
            next(); // User is an admin, proceed to the next middleware
        } else {
            res.status(403).send('Access denied. Only admins can perform this action.');
        }
    });
};

// POST - Add a new game (Only admins)
router.post('/', verifyToken, isAdmin, (req, res) => {
    const { name, description, release_date, developer_id, age_rating } = req.body;
    const sql = 'INSERT INTO game (name, description, release_date, developer_id, age_rating) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, release_date, developer_id, age_rating], (err, result) => {
        if (err) {
            console.error('Error adding game:', err);
            return res.status(500).send('Error adding game');
        }
        res.status(201).send('Game added successfully');
    });
});

// PUT - Update game details (Only admins)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, release_date, developer_id, age_rating } = req.body;
    const sql = 'UPDATE game SET name = ?, description = ?, release_date = ?, developer_id = ?, age_rating = ? WHERE game_id = ?';
    db.query(sql, [name, description, release_date, developer_id, age_rating, id], (err) => {
        if (err) {
            console.error('Error updating game:', err);
            return res.status(500).send('Error updating game');
        }
        res.send('Game updated successfully');
    });
});

// DELETE - Delete a game (Only admins)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM game WHERE game_id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting game:', err);
            return res.status(500).send('Error deleting game');
        }
        res.send('Game deleted successfully');
    });
});

module.exports = router;

