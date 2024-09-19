const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {String} url
 * @param {Boolean} isOnce
 */
module.exports = async (url, isOnce = false) => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }

  const schemas = fs
    .readdirSync(path.join(__dirname, "schemas"))
    .filter((file) => file.endsWith(".js"));

  for (const schema of schemas) {
    const s = require(path.join(__dirname, "schemas", schema));

    const data = await s.find();
    const json = JSON.stringify(data, null, 2);

    // get model name
    const modelName = s.collection.collectionName;

    // create backup folder, if not exist
    if (!fs.existsSync(path.join(__dirname, "backup"))) {
      fs.mkdirSync(path.join(__dirname, "backup"));
    }

    fs.writeFileSync(path.join(__dirname, "backup", `${modelName}.json`), json);

    console.log(`Backup ${modelName} successfully!`);
  }

  if (isOnce) {
    mongoose.connection.close();
  }
};
