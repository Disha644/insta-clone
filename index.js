const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');

const Auth = require('./routes/auth');
const Post = require('./routes/post');
const User = require('./routes/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors()); /*don't need to use it while deploying because both client and server will run on same port now*/

app.use('/users', User);
app.use('/posts', Post);
app.use('/', Auth);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.js'))
    })
}

const MONGO_URI = config.get('MONGO_URI');

const PORT = process.env.PORT || 5000;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    })
    .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);



