const Discord = require("discord.js");
const fs = require("fs");

module.exports = client => {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.helps = new Discord.Collection();

  fs.readdir("./commands/", (err, categories) => {
    if (err) console.log(err);
    console.log(`Ditemukan ${categories.length} folder kategori.`);
    categories.forEach(category => {
      let moduleConf = require(`../commands/${category}/module.json`);
      moduleConf.path = `./commands/${category}`;
      moduleConf.cmds = [];
      client.helps.set(category, moduleConf);
      if (!moduleConf) return;
      fs.readdir(`./commands/${category}`, (err, files) => {
        console.log(
          `Ditemukan ${files.length - 1} perintah dari folder ${category}.`
        );
        if (err) console.log(err);
        let commands = new Array();
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          let prop = require(`../commands/${category}/${file}`);
          let cmdName = file.split(".")[0];
          client.commands.set(prop.help.name, prop);
          prop.conf.aliases.forEach(alias => {
            client.aliases.set(alias, prop.help.name);
          });
          client.helps.get(category).cmds.push(prop.help.name);
        });
      });
    });
  });
};