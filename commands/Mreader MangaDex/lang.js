let Discord = require('discord.js');
exports.run = async (client, message, args) => {
    //verify
    if (!args[0]) return message.reply('to see lang code, use \`k!lang list\`').then(t => t.delete({ timeout: 5000 }))

    //language list
    if (args[0] == 'list') {
        message.channel.send(`\`\`\`ASCIIDOC
        Arabic                  :: SA
        Bengali                 :: BD
        Bulgarian               :: BG
        Burmese                 :: MM
        Catalan                 :: CT
        Chinese(Simple)         :: CN
        Chinese(Traditional)    :: HK
        Czech                   :: CZ
        Danish                  :: DK
        Dutch                   :: NL
        English                 :: GB
        Filipino                :: PH
        Finnish                 :: FI
        French                  :: FR
        German                  :: DE
        Greek                   :: GR
        Hebrew                  :: IL
        Hungarian               :: HU
        Indonesian              :: ID
        Italian                 :: IT
        Japanese                :: JP
        Korean                  :: KR
        Lithuanian              :: LT
        Malaysian               :: MY
        Mongolian               :: MN
        Persian                 :: IR
        Polish                  :: PL
        Portuguese(Brazil)      :: BR
        Portuguese(Portugal)    :: PT
        Romanian                :: RO
        Russian                 :: RU
        Serbo-Croatian          :: RS
        Spanish(Spain)          :: ES
        Spanish(Latin America)  :: MX
        Swedish                 :: SE
        Thailand                :: TH
        Turkish                 :: TR
        Ukranian                :: UA
        Vietnamese              :: VN
        \`\`\``);
    }
    //enter code of country
    let lang = args[0].toUpperCase();
    let query = args.slice(1).join(' ');
    if (!client.config.mangadex.language.includes(lang)) return message.reply(`\`${lang}\` Not Found!`);
    if (!query) return message.reply('pls enter your query!').then(t => t.delete({ timeout: 5000 }));

    await client.mangadex.getInformation(query, lang, message);
};

exports.conf = {
    aliases: [],
    cooldown: 10
};

exports.help = {
    name: 'lang',
    description: 'search manga with specific language',
    usage: 'lang <query> <lang>',
    example: 'lang kanojo okarishimasu GB'
};