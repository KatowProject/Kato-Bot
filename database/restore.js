const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const restore = async (url, isOnce = false) => {
    // check mongoose is connected
    if (!mongoose.connection.readyState) {
        mongoose.connect(url);
    }

    // import from json
    const modelsImport = fs.readdirSync(path.join(__dirname, 'schemas')).filter(file => file.endsWith('.js'));
    for (const file of modelsImport) {
        // get model
        const db = require(`./schemas/${file}`);
        if (typeof db === 'object') {
            await objectSchema(db);
            continue;
        }

        const modelName = db.collection.collectionName;

        // read file
        const data = fs.readFileSync(path.join(__dirname, 'backup', `${modelName}.json`), 'utf8');
        // import data
        await db.insertMany(JSON.parse(data));

        // log
        console.log(`Restore ${modelName} success!`);
    }

    if (isOnce) {
        process.exit(0);
    }
}

const objectSchema = async (db) => {
    const schemas = Object.values(db);
    for (const schema of schemas) {
        // get model name
        const modelName = schema.collection.collectionName;

        // read file
        const data = fs.readFileSync(path.join(__dirname, 'backup', `${modelName}.json`), 'utf8');

        // import data
        await schema.insertMany(JSON.parse(data));

        // log
        console.log(`Restore ${modelName} success!`);
    }
}

module.exports = restore;