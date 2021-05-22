const db = require('mongoose');

const conn = (account) => {

    db.connect(account, { useNewUrlParser: true, useUnifiedTopology: true });

    db.connection
        .on('error', console.error.bind(console, 'Connection Error: '))
        .on('open', () => console.log('Telah terhubung ke db!'))
        .on('close', () => console.log('Telah terputus dari db!'));

}

module.exports = conn;