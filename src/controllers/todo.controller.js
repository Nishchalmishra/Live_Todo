import { Todo } from "../models/todo.model.js"

const createTodo = async (req, res) => {
    const { title, description } = req.body
    
    const user = req.user._id

    const createTodo = await Todo.create({
        title,
        description,
        user
    })
    return res.status(201).json({
        success: true,
        data: createTodo
    })
}

const getTodo = async (req, res) => {
    const getTodo = await Todo.find({ user: req.user._id }).populate("user")
    return res.status(200).json({
        success: true,
        data: getTodo
    })
}

const deleteTodo = async (req, res) => {
    const deleteTodo = await Todo.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success: true,
        data: deleteTodo
    })
}

export { createTodo, getTodo, deleteTodo }