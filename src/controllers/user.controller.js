import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const generateUserAccessAndGenerate = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save()
        
        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw Error( error)
    }
}

export const registerUser = async (req, res) => {
    
    const { name, email, password } = req.body
    
    if (!email || !name || !password) {
        throw new Error("All field required")
    }

    const existingUser = await User.findOne({ email }).select("-password")
    
    if (existingUser) {
        throw new Error("User already exist")
    }

    const createUser = await User.create({
        email,  
        name,
        password
    })

    return res.status(201).json({
        success: true,
        data: createUser
    })

}

export const userLogin = async (req, res) => {
    
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new Error("All field is required")
    }

    const userSearch = await User.findOne({ email })
    
    if (!userSearch) {
        throw new Error("user not found")
    }

    const passwordCorrect = await userSearch.matchPassword(password)
    if (!passwordCorrect) {
        throw new Error("password not matched")
    }

    // console.log("USER FOUND ===>", userSearch)

    const {accessToken , refreshToken} = await generateUserAccessAndGenerate(userSearch._id)

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .json({
        success: true,
        data: userSearch
    })

}

export const resetRefreshToken = async (req, res)=>{
    
    const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken

    if(!incomingRefreshToken){
        throw new Error("Refresh token not found")
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        const {accessToken, refreshToken:newRefreshToken} = await generateUserAccessAndGenerate(user._id)

        user.refreshToken = newRefreshToken
        await user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed successfully"
                )

            )
    } catch (error) {
        throw new Error(error)
    }

}