import { z } from 'zod'

export const beerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    brandId: z.string().min(1, { message: 'Brand ID is required' }),
    alcoholByVolume: z.number().min(0, { message: 'ABV must be greater than 0' }).max(100, { message: 'ABV must be less than 100' }),
    categoryId: z.string().min(1, { message: 'Category ID is required' }),
    originId: z.string().nullable().optional(),

    packagingId: z.string().min(1, { message: 'Packaging ID is required' }),
    volumeCc: z.number().min(0, { message: 'Volume must be greater than 0' }),

    beerStyleId: z.string().min(1, { message: 'Beer style ID is required' }),
    ibu: z.number().min(0, { message: 'IBU must be greater than 0' }).max(100, { message: 'IBU must be less than 100' }).nullable().optional(),
    servingTempMinC: z.number().nullable().optional(),
    servingTempMaxC: z.number().nullable().optional(),
})

export const beerFiltersSchema = z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    style: z.string().optional(),
    packaging: z.string().optional(),
    country: z.string().optional(),
    minAbv: z.number().min(0).max(100).optional(),
    maxAbv: z.number().min(0).max(100).optional(),
    minIbu: z.number().min(0).optional(),
    maxIbu: z.number().min(0).optional(),
    minVolume: z.number().min(0).optional(),
    maxVolume: z.number().min(0).optional(),
})

export const beerStyleSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().nullable().optional(),
    originId: z.string().min(1, { message: 'Origin ID is required' }),
    parentStyleId: z.string().nullable().optional(),
})
