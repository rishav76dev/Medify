import mongoose ,{model}from "mongoose";

const doctorSchema = new mongoose.Schema({
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
        required: true
    },
    speciality:{
        type: String,
        required: true
    },
    degree:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: true
    },
    available:{
        type: Boolean,
        required: true
    },
    fees:{
        type: Number,
        required: true
    },
    address:{
        type: Object,
        required: true
    },
    date:{
        type:Number,
        required:true
    },
    slots_booked: { type: Object, default: {}}
},{minimize: false })

export const DoctorModel = model("Doctor", doctorSchema )

//  slots_booked: object
// slots_booked: { type: Object, default: {} }
// Stores the doctor’s booked time slots for appointments.
// Empty object by default.
// Not minimized due to { minimize: false }, which means empty objects will be stored, not removed.
// 🛠️ { minimize: false }
// This schema option tells Mongoose not to remove empty objects. By default, if slots_booked is {}, it might not be stored in the DB. With minimize: false, it will be stored, useful if you rely on that key existing.