import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },

        refreshToken: {
            type: String,
        },
        
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        // console.log("PRE SAVE HOOK RUNNING")
        // console.log("isModified:", this.isModified("password"))

        return
    }
    // const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
    console.log("PRE SAVE HOOK RUNNING")
})

// userSchema.pre("save", function (next) {

//     if (!this.isModified("password")) {
//         console.log("Pre Hook... ")
//         console.log("next hai:", typeof next)
//         return next();
//     }

//     bcrypt.hash(this.password, 10)
//         .then(hash => {
//             this.password = hash;
//             next();
//         })
//         .catch(err => next(err));
//     console.log("here")

// });


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const User = mongoose.model("User", userSchema);