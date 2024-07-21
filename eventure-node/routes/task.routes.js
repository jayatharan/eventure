import { Router } from "express"
import { getMyTasks, updateTaskStatus } from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.get("/my-tasks", getMyTasks)
taskRouter.post("/:taskId/update-status", updateTaskStatus)

export default taskRouter;