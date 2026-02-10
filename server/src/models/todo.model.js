import mongoose, { Schema } from "mongoose";

const todoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    }
)

export const Todo = mongoose.model("Todo", todoSchema);