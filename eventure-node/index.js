import "./config/dotenv.js"
import startApp from "./boot/setup.js";
import logger from "./middleware/winston.js"

(() => {
    try {
      startApp();
    } catch (error) {
      logger.info("Error in index.js => startApp");
      throw error;
    }
})();