const express = require('express');
const router = express.Router();

const db = require('../database'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verify-token');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET; 

// Register a new account
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO account (username, email, pass) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error creating account:', err);
                return res.status(500).send('Error creating account');
            }
            const token = jwt.sign({ username, email }, jwtSecret, { expiresIn: '1h' });
            res.status(201).json({ message: 'Account created successfully', token });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Failed to create account');
    }
});

// Login to account
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM account WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            res.status(500).send('Error logging in');
        } else if (results.length > 0) {
            const validPassword = await bcrypt.compare(password, results[0].pass);
            if (validPassword) {
                const token = jwt.sign({ id: results[0].account_id }, jwtSecret, { expiresIn: '1h' });
                res.json({ message: 'Login successful', token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Retrieve an account by ID
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT account_id, username, email, date_created, account_type FROM account WHERE account_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching account:', err);
            res.status(500).send('Error fetching account');
        } else if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send('Account not found');
        }
    });
});

// Update an account
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = 'UPDATE account SET username = ?, email = ?, pass = ? WHERE account_id = ?';
    db.query(sql, [username, email, hashedPassword, id], (err) => {
        if (err) {
            console.error('Error updating account:', err);
            return res.status(500).send('Error updating account');
        }
        res.send('Account updated successfully');
    });
});

// Delete an account
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM account WHERE account_id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).send('Error deleting account');
        }
        res.send('Account deleted successfully');
    });
});

module.exports = router;
