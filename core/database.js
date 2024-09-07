const Mongoose = require("mongoose");

module.exports = async (uri, options = {}) => {
  try {
    Mongoose.set("strictQuery", true);

    Mongoose.connect(uri, options);

    Mongoose.connection
      .on("connected", () => console.log("Database connected."))
      .on("disconnected", () => console.log("Database disconnected."))
      .on("error", (error) => console.error(error))
      .on("reconnectFailed", () => console.error("Reconnect failed."));
  } catch (error) {
    console.error(error);
  }
};
