import { createTodo, getTodo, deleteTodo } from "../controllers/todo.controller.js";
import express from "express";
import { jwtVerify } from "../validators/jwtVerify.js";

const router = express.Router();


router.post("/", jwtVerify,createTodo);

router.get("/", jwtVerify, getTodo);

router.delete("/:id", jwtVerify, deleteTodo);

export default router