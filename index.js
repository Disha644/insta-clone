const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/keys');

const Auth = require('./routes/auth');
const Post = require('./routes/post');
const User = require('./routes/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const CONNECTION_URL = 'mongodb://localhost:27017/instagram-clone';

const PORT = process.env.PORT || 5000;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    })
    .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);



