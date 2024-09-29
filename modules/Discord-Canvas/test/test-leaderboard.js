const DiscordCanvas = require('../index');
const leaderboard = new DiscordCanvas().loadLeaderboardDonatur();
const fs = require('fs');

try {
    leaderboard.setMonth(7);

    const donatur = [
        {
            username: 'User 1',
            avatar: 'https://cdn.discordapp.com/avatars/725735701739601980/12a8a5383ba3b2dca70a4dc3773bf072.png?size=4096',
            donation: 'Rp1.000.000'
        },
        {
            username: 'User 2',
            avatar: 'https://cdn.discordapp.com/avatars/458342161474387999/22926c692b8669497cee8836d8ba530d.png?size=4096',
            donation: 'Rp500.000'
        },
        {
            username: 'User 3',
            avatar: 'https://cdn.discordapp.com/avatars/750234101121810435/102adef0261242515b79a618c1111905.png?size=4096',
            donation: 'Rp250.000'
        }
    ]

    leaderboard.setDonatur(donatur);

    const buffer = leaderboard.generate().then(buffer => {
        fs.writeFileSync('test-leaderboard.png', buffer);
    });
} catch (err) {
    console.log(err);
    console.log(err.message);
}