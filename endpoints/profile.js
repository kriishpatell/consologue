const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('./verify-token');

// POST - Create a new profile
router.post('/', verifyToken, (req, res) => {
    const { account_id, username, first_name, last_name, date_of_birth, bio, is_private } = req.body;
    const sql = 'INSERT INTO profile (account_id, username, first_name, last_name, date_of_birth, bio, is_private) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [account_id, username, first_name, last_name, date_of_birth, bio, is_private], (err, result) => {
        if (err) {
            console.error('Error creating profile:', err);
            return res.status(500).send('Error creating profile');
        }
        res.status(201).send('Profile created successfully');
    });
});

// GET - Retrieve a profile by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM profile WHERE profile_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).send('Error fetching profile');
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send('Profile not found');
        }
    });
});

// PUT - Update a profile
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { username, first_name, last_name, date_of_birth, bio, is_private } = req.body;
    const sql = 'UPDATE profile SET username = ?, first_name = ?, last_name = ?, date_of_birth = ?, bio = ?, is_private = ? WHERE profile_id = ?';
    db.query(sql, [username, first_name, last_name, date_of_birth, bio, is_private, id], (err) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).send('Error updating profile');
        }
        res.send('Profile updated successfully');
    });
});

// DELETE - Delete a profile
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM profile WHERE profile_id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting profile:', err);
            return res.status(500).send('Error deleting profile');
        }
        res.send('Profile deleted successfully');
    });
});

module.exports = router;
