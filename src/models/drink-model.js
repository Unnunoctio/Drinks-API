import { model, Schema } from 'mongoose'
import { customAlphabet } from 'nanoid'
import { CATEGORY, PACKAGING, STRAIN, SUB_CATEGORY, VARIETY } from '../enum.js'

const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(lowercase, 10)

const DrinkSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  name: { type: String, required: true, trim: true, index: true },
  brand: { type: String, required: true, trim: true, index: true },
  abv: { type: Number, required: true, min: 0, max: 100 },
  volume: { type: Number, required: true, min: 0 }, // in cc
  packaging: { type: String, required: true, enum: PACKAGING, index: true },
  category: { type: String, required: true, enum: CATEGORY, index: true },
  subCategory: { type: String, required: true, enum: SUB_CATEGORY },
  origin: { type: String, required: true, trim: true },
  // ? CERVEZAS
  variety: { type: String, enum: VARIETY },
  ibu: { type: Number, min: 0, max: 100 },
  servingTemp: { type: String, trim: true },
  // ? VINOS
  strain: { type: String, enum: STRAIN },
  vineyard: { type: String, trim: true }
}, {
  timestamps: true,
  versionKey: false
})

const DrinkModel = model('Drink', DrinkSchema, 'drinks')
export default DrinkModel
