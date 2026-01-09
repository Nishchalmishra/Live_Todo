import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const jwtVerify = async (req, res, next) => {
    const token = req.cookies?.accessToken||req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        req.user = user
        console.log("here man!!")
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}