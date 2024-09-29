const { registerFont, Canvas } = require("canvas");
const path = require("path");
const fs = require("fs");

const LeaderboardDonatur = require("./methods/leaderboard-donatur");
const DonaturNotification = require("./methods/donatur-notification");
const BoosterNotification = require("./methods/booster-notification");

const files = fs.readdirSync(path.join(__dirname, "fonts"));
for (const file of files) {
  const name = file.split(".")[0];
  const family = name.replace(/-/g, " ");

  registerFont(path.join(__dirname, "fonts", file), { family });
}

class CanvasManager {
  /**
   * Donatur Notification template
   * @returns {DonaturNotification}
   */
  donaturNotification() {
    return new DonaturNotification();
  }

  /**
   * Leaderboard Donatur template
   * @returns {LeaderboardDonatur}
   */
  leaderboardDonatur() {
    return new LeaderboardDonatur();
  }

  /**
   * Booster Notification template
   * @returns {BoosterNotification}
   */
  boosterNotification() {
    return new BoosterNotification();
  }
}

module.exports = CanvasManager;
