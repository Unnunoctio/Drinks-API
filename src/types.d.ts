
export interface IDrink {
  name: string
  brand: string
  alcoholicGrade: number
  contents: number[]
  package: string
  category: string
  subCategory: string
  madeIn: string
  // Beers
  variety?: string
  bitterness?: number
  temperature?: string
  // Wines
  strain?: string
  vineyard?: string
}
