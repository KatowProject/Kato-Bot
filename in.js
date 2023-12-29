require('dotenv').config();

console.log(process.env.SELFBOT_TOKEN.split(',').map(x => x.trim()));