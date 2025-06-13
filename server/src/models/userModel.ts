import mongoose ,{model}from "mongoose";
//todo a image for default user 51420

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true  
    },
    image: {
        type: String,
        default: ""
    },
    address:{
        type: Object,
        required: true
    },
    gender:{
        type:String,default:"Not selected"
    },
    dob:{type:String,default:"Not selected"},
    phone:{type:String,default:'0000000000'}

})

export const userModel = model("user", userSchema )
