import User from "../models/userModel.js";
import { generateTokens } from "../utils/jwt.utils.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";

export const signUp = async (req, res) => {
    const {
        name,
        password
    } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        password: hashedPassword,
    })

    const tokens = await generateTokens(user);

    return res.send({
        user,
        tokens
    })
}

export const login = async (req, res) => {
    const {
        name,
        password
    } = req.body;

    const user = await User.findOne({
        name
    })

    const passwordMatched = await comparePassword(password, user.password)

    if(!passwordMatched){
        return res.status(401).send(null)
    }

    const tokens = await generateTokens(user);

    return res.send({
        user,
        tokens
    })
}

export const nameCheck = async (req, res) => {
    const {
        name
    } = req.query
    
    const exist = await User.exists({
        name
    })

    return res.send({
        exist : exist ? true : false
    })
}