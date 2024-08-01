import { verifyToken } from "../utils/jwt.utils.js";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
      return res.sendStatus(401); 
    }
  
    const tokenPayload = verifyToken(token);

    if(!tokenPayload) {
        return res.sendStatus(403); 
    }

    req.user = tokenPayload;
    next(); 
};

export default authenticateToken;