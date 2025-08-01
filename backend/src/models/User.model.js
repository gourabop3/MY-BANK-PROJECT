const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    // good Array of linked bank accounts for the user. This enables
    // `.populate('account_no')` queries used throughout the
    // services (TransferService, RechargeService, etc.)
    // Each element references a document from the `account` collection.
    account_no:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account'
    }],
    ac_type:{
        type:String,
        required:true,
        enum:['saving','current'],
        default:'saving'
    },
    isActive:{
        type:Boolean,
        default:true
    },

    // Unique UPI handle for the user (e.g., gourab@sbibank)
    upi_id:{
        type:String,
        unique:true,
        sparse:true,
        trim:true
    },
    
    // Hashed UPI PIN (stored securely, excluded from default queries)
    upi_pin:{
        type:String,
        select:false
    }
},{
    timestamps:true
})


schema.pre("save",async function(next){
    const user =this;
    if(user.isModified("password")){
        this.password = await bcryptjs.hash(user.password,10)
    }
    
    // Hash UPI PIN when it is newly set or modified
    if(user.isModified("upi_pin") && user.upi_pin){
        this.upi_pin = await bcryptjs.hash(user.upi_pin,10)
    }
    next()
})

const model = mongoose.model("user",schema)

exports.UserModel =model