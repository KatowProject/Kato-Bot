const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const config = require("../config/environment.json");

module.exports = async (isOnce = false, schemaName = false) => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(config.database.uri);
  }

  const models = fs
    .readdirSync(path.join(__dirname, "schemas"))
    .filter((file) => file.endsWith(".js"));
  for (const model of models) {
    const m = require(`./schemas/${model}`);

    const modelName = m.collection.collectionName;
    if (schemaName && schemaName !== modelName) continue;

    const data = fs.readFileSync(
      path.join(__dirname, "backup", `${modelName}.json`),
      "utf8"
    );

    await m.deleteMany();

    await m.insertMany(JSON.parse(data));

    console.log(`Restore ${modelName} successfully!`);
  }

  if (isOnce) {
    mongoose.connection.close();
  }
};
