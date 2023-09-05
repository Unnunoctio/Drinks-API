import { Schema, model } from 'mongoose'
import { Category, Package, Strain, SubCategory, Variety } from '../enums.js'

const DrinkSchema = Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  alcoholic_grade: { type: Number, required: true },
  content: { type: Number, required: true },
  package: { type: String, required: true, trim: true, enum: Object.values(Package) },
  category: { type: String, required: true, trim: true, enum: Object.values(Category) },
  sub_category: { type: String, required: true, trim: true, enum: Object.values(SubCategory) },
  made_in: { type: String, trim: true },
  variety: { type: String, trim: true, enum: Object.values(Variety) }, // Cervezas
  bitterness: { type: String, trim: true }, // Cervezas
  strain: { type: String, trim: true, enum: Object.values(Strain) }, // Vinos
  vineyard: { type: String, trim: true } // Vinos
})

const DrinkModel = model('Drink', DrinkSchema)
export default DrinkModel
