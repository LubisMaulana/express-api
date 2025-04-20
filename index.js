const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});