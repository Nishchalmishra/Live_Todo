import { Todo } from "../models/todo.model.js"
import redis from "../../redisClient.js"

const createTodo = async (req, res) => {
    const { title, description } = req.body
    
    const user = req.user._id

    const createTodo = await Todo.create({
        title,
        description,
        user
    })

    await redis.del('todo:all');
    
    return res.status(201).json({
        success: true,
        data: createTodo
    })
}

const getTodo = async (req, res) => {

    const cacheKey = 'todo:all';

    const cachedTodos = await redis.get(cacheKey);

    if (cachedTodos) {
        console.log('⚡ from redis');
        return res.json(JSON.parse(cachedTodos));
    } else {
        console.log("no cache")
    }


    const todo = await Todo.find({ user: req.user._id }).populate("user")

    await redis.set(
        cacheKey,
        JSON.stringify(todo),
        'EX',
        60 
    );

    return res.status(200).json({
        success: true,
        data: todo
    })
}

const deleteTodo = async (req, res) => {
    const deleteTodo = await Todo.findByIdAndDelete(req.params.id)
    
    await redis.del('todo:all');
    await redis.del(`todo:${req.params.id}`);
    return res.status(200).json({
        success: true,
        data: deleteTodo
    })
}

export { createTodo, getTodo, deleteTodo }