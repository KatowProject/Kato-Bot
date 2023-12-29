const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const backup = async (url, isOnce = false) => {
    // check mongoose is connected
    if (!mongoose.connection.readyState) {
        await mongoose.connect(url);

        mongoose.connection
            .on('error', console.error.bind(console, 'connection error:'))
            .on('open', () => console.log('connected to mongodb'))
            .on('disconnected', () => console.log('disconnected from mongodb'))
            .on('reconnected', () => console.log('reconnected to mongodb'));
    }

    // export to json
    const modelsExport = fs.readdirSync(path.join(__dirname, 'schemas')).filter(file => file.endsWith('.js'));
    for (const file of modelsExport) {

        const db = require(`./schemas/${file}`);
        if (typeof db === 'object') {
            await objectSchema(db);
            continue;
        }

        // export to json
        const data = await db.find({});
        const json = JSON.stringify(data, null, 2);

        // get model name
        const modelName = db.collection.collectionName;

        // create folder backup if not exist
        if (!fs.existsSync(path.join(__dirname, 'backup'))) {
            fs.mkdirSync(path.join(__dirname, 'backup'));
        }

        // write to file
        fs.writeFileSync(path.join(__dirname, 'backup', `${modelName}.json`), json);

        // log
        console.log(`Backup ${modelName} success!`);
    }

    if (isOnce) {
        process.exit(0);
    }
}

const objectSchema = async (db) => {
    // object to array
    const schemas = Object.values(db);
    for (const schema of schemas) {
        const data = await schema.find({});
        const json = JSON.stringify(data, null, 2);

        // get model name
        const modelName = schema.collection.collectionName;

        // create folder backup if not exist
        if (!fs.existsSync(path.join(__dirname, 'backup'))) {
            fs.mkdirSync(path.join(__dirname, 'backup'));
        }

        // write to file
        fs.writeFileSync(path.join(__dirname, 'backup', `${modelName}.json`), json);
        // log
        console.log(`Backup ${modelName} success!`);
    }
}

module.exports = backup;