module.exports = async (client, interaction) => {
    require('../handler/selfrole')(client, interaction);
    require('../handler/role')(client, interaction);
}