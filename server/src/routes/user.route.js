import express from "express";
import { registerUser, userLogin, resetRefreshToken } from "../controllers/user.controller.js";
import { jwtVerify } from "../validators/jwtVerify.js";

const router = express.Router();


router.post("/register", registerUser);

router.post("/login", userLogin);

router.post("/refresh-token", jwtVerify, resetRefreshToken);

export default router