import { Router } from "express"
import { changePassword, login, nameCheck, refreshToken, signUp } from "../controllers/auth.controller.js"
import authenticateToken from "../middleware/authenticateToken.js"

const authRouter = Router()

authRouter.get("/name-check", nameCheck)
authRouter.post("/sign-up", signUp)
authRouter.post("/login", login)
authRouter.post("/refresh-token", refreshToken)
authRouter.post("/change-password", authenticateToken, changePassword)

export default authRouter;