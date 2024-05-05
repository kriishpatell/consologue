const express = require('express');
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Import route modules
const accountsRouter = require('./routes/account');
const gamesRouter = require('./routes/game');
const manageGamesRouter = require('./routes/manage-game'); 
const profileRouter = require('./routes/profile');
const reviewsRouter = require('./routes/review');

// Use route modules with specific prefixes
app.use('/api/account', accountsRouter);
app.use('/api/game', gamesRouter);
app.use('/api/manage-game', manageGamesRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/reviews', reviewsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the IGDB Clone API!');
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
