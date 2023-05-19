import {model, Schema} from "mongoose"

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: {type:  String},
    price: {type: Number, required: true}

})

export const Product = model('Product', ProductSchema)