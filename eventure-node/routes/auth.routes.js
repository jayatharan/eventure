import { Router } from "express"
import { login, nameCheck, refreshToken, signUp } from "../controllers/auth.controller.js"

const authRouter = Router()

authRouter.get("/name-check", nameCheck)
authRouter.post("/sign-up", signUp)
authRouter.post("/login", login)
authRouter.post("/refresh-token", refreshToken)

export default authRouter;