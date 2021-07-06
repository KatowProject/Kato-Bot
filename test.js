let i = 0
let isTrue = true
const temp = []
const axios = require('axios');

const awo = async () => {


    while (isTrue) {
        const response = await axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/336336077755252738?page=' + i)
        const users = response.data.players

        for (const user of users) {
            if (user.level >= 20) {
                temp.push(user)
            } else {
                isTrue = false
            }
        }
        i++
    }

    console.log(temp)
}

awo()