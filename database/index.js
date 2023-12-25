const db = require('mongoose');

module.exports = (url) => {
    db.set('strictQuery', true);
    db.connect(url);

    db.connection
        .on('error', console.error.bind(console, 'connection error:'))
        .on('open', () => console.log('connected to mongodb'))
        .on('disconnected', () => console.log('disconnected from mongodb'))
        .on('reconnected', () => console.log('reconnected to mongodb'));
}