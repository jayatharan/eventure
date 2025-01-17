import express from "express"
import helmet from "helmet"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan" 
import logger from '../middleware/winston.js'; 
import taskRouter from "../routes/task.routes.js"
import participantRouter from "../routes/participant.routes.js"
import userRouter from "../routes/user.routes.js"
import authRouter from "../routes/auth.routes.js"

import "../models/userModel.js"
import "../models/eventModel.js"
import "../models/taskModel.js"
import "../models/participantModel.js"
import authenticateToken from "../middleware/authenticateToken.js"

const PORT = 8000;
const app = express()

const MONGO_CONNECTION_URL = "mongodb://mongo:27017/eventure"

try {
    mongoose.connect(MONGO_CONNECTION_URL,  {
      });
    logger.info("Connected to MongoDB");
} catch (error) {
logger.error("Error Connecting to MongoDB");
}

const registerCoreMiddleWare = () => {
    try{
        app.use(morgan("combined", { stream: logger.stream }));
        app.use(cors());
        app.use(helmet());
        app.use(express.json());     

        app.use("/auth", authRouter)
        app.use("/tasks", authenticateToken, taskRouter)
        app.use("/participants", authenticateToken, participantRouter)
        app.use("/users", authenticateToken, userRouter)
    }catch(error){
        logger.error(error.message);
    }
}


const handleError = () => {
    process.on("uncaughtException", (err) => {
      logger.error(err.message);
    });
};

  
const startApp = () => {
    try{
        registerCoreMiddleWare();

        app.listen(PORT, () => {
          logger.info("Server running on http://127.0.0.1:" + PORT);
        });
    
        handleError();
    }catch(error){
        logger.error("startup :: Error while booting application");
        throw error;
    }
}

export default startApp;