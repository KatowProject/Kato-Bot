const db = require('mongoose');

module.exports = (url) => {
    db.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    db.connection
        .on('error', (err) => console.error(err))
        .on('open', () => console.log('Berhasil Terhubung ke Database!'))
        .on('disconnected', () => console.log('Terputus dari Database!'))
        .on('reconnected', () => console.log('Berhasil Terhubung ke Database!'))
        .on('close', () => console.log('Terputus dari Database!'));
};