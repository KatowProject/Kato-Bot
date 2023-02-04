module.exports = async (client, queue, err) => {
    console.log(err);
    console.log(`Connection error in ${queue.guild.name} | ${queue.guild.id}`);
}