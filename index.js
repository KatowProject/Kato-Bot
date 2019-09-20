const discord = require('discord.js');
const client = new discord.Client();
const config = require("./botconfig.json");
let prefix = config.prefix;
let token = config.token;
const fs = require("fs"); //fs ini perlu
client.commands = new discord.Collection();

 fs.readdir("./cmd", (err, files) => {
  if(err) console.log(err);
  let filejs = files.filter(f => f.split(".").pop() === "js");
  if(filejs.length <= 0){
    console.log("This command is not found.");
    return;
  }

  
  filejs.forEach((f, i) => {
    let props = require(`./cmd/${f}`);
    client.commands.set(props.help.name, props);
  });
});

/* 
Client Status (8 Juli 2019 17:12)
Source: https://discord.js.org/

client.on("ready", () => {
  console.log("lapor, bot telah aktif!");

  client.user.setPresence({ game: { name: 'with Katoww | type k!help' }, status: 'Online' })
  .then(console.log)
  .catch(console.error);

});
*/

/* 
Client Status (New) (8 Juli 2019 17:19)
Source: Skymunn (Special thanks to him)
Catatan kecil:
• genre1 dapat ditambah menjadi genre 3 sampai seterusnya.
• dengan menambahkan let, lalu letakkan di dalam status [], serta pisahkan dengan koma.
• untuk link twitch boleh random, tidak harus PlaneSky
• untuk setInterval, ane set 15 detik (15000). Ini anjuran pihak staff discord.js sendiri.
• dan boleh lebih dari 15 detik (15000)
*/
client.on("ready", () => {
  console.log("lapor, bot telah aktif!");

  function banyakStatus() {
    let genre1 = "with Katoww";
    let genre2 = "type k!help";
    let genre3 = "tanpa kato hidup serasa hampa"
    let status = [
        genre1,
        genre2,
        genre3
    ]

    let statusR = Math.floor(Math.random() * status.length);
    client.user.setGame(status[statusR], "https://www.twitch.tv/PlaneSky");
  };
  setInterval(banyakStatus, 15000);
});


client.on("message", async message => {
  if(message.author.bot) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(!cmd.startsWith(prefix)) return;

  let filecmd = client.commands.get(cmd.replace(prefix, ''));
  if(filecmd) filecmd.run(client, message, args);
});

client.login(token);
