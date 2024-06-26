import { Schema, model, type Document } from 'mongoose'
import type { IDrink } from '../types'
import { BeerVariety, DrinkCategory, DrinkPackage, DrinkSubCategory, WineStrain } from '../enum'

export interface MDrink extends Document, IDrink {
  // Meta
  createdAt: Date
  updatedAt: Date
}

const drinkSchema = new Schema<MDrink>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    alcoholicGrade: { type: Number, required: true },
    contents: [{ type: Number, required: true }],
    package: { type: String, required: true, trim: true, enum: Object.values(DrinkPackage) },
    category: { type: String, required: true, trim: true, enum: Object.values(DrinkCategory) },
    subCategory: { type: String, required: true, trim: true, enum: Object.values(DrinkSubCategory) },
    madeIn: { type: String, required: true, trim: true },
    // Beers
    variety: { type: String, trim: true, enum: Object.values(BeerVariety) },
    bitterness: { type: Number },
    temperature: { type: String, trim: true },
    // Wines
    strain: { type: String, trim: true, enum: Object.values(WineStrain) },
    vineyard: { type: String, trim: true }
  },
  { timestamps: true, versionKey: false }
)

const DrinkModel = model<MDrink>('Drink', drinkSchema)
export default DrinkModel
