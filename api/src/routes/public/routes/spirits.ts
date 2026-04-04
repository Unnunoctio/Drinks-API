import * as schema from '@/db/schema'
import { parseQuery } from '@/utils/parseQuery'
import { spiritFiltersSchema } from '@/validations/spiritValidations'
import { paginationSchema } from '@/validations/paginationValidations'
import { SQL, and, eq, gte, like, lte, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const route = new Hono<{ Bindings: Bindings }>()

route.get('/spirits', async (c) => {
    try {
        const query = parseQuery(c.req.query())
        const pagination = paginationSchema.safeParse(query)
        if (pagination.error !== undefined) return c.json({ error: JSON.parse(pagination.error.message) }, 400)

        const filters = spiritFiltersSchema.safeParse(query)
        if (filters.error !== undefined) return c.json({ error: JSON.parse(filters.error.message) }, 400)

        const { page, limit } = pagination.data
        const offset = (page - 1) * limit

        const conditions: SQL[] = []
        if (filters.data.name !== undefined) conditions.push(like(schema.drinks.name, `%${filters.data.name}%`))
        if (filters.data.brand !== undefined) conditions.push(like(schema.brands.name, `%${filters.data.brand}%`))
        if (filters.data.type !== undefined) conditions.push(eq(schema.spiritTypes.name, filters.data.type))
        if (filters.data.packaging !== undefined) conditions.push(eq(schema.packaging.name, filters.data.packaging))
        if (filters.data.country !== undefined) conditions.push(eq(schema.countries.name, filters.data.country))
        if (filters.data.agingContainer !== undefined) conditions.push(eq(schema.spiritAgingContainers.name, filters.data.agingContainer))
        if (filters.data.minAbv !== undefined) conditions.push(gte(schema.drinks.alcoholByVolume, filters.data.minAbv))
        if (filters.data.maxAbv !== undefined) conditions.push(lte(schema.drinks.alcoholByVolume, filters.data.maxAbv))
        if (filters.data.minVolume !== undefined) conditions.push(gte(schema.drinkFormats.volumeCc, filters.data.minVolume))
        if (filters.data.maxVolume !== undefined) conditions.push(lte(schema.drinkFormats.volumeCc, filters.data.maxVolume))
        if (filters.data.minAgingTimeMonths !== undefined) conditions.push(gte(schema.spirits.agingTimeMonths, filters.data.minAgingTimeMonths))
        if (filters.data.maxAgingTimeMonths !== undefined) conditions.push(lte(schema.spirits.agingTimeMonths, filters.data.maxAgingTimeMonths))

        const db = drizzle(c.env.DB, { schema })
        const spirits = await db
            .select({
                id: schema.spirits.drinkId,
                name: schema.drinks.name,
                brand: schema.brands.name,
                abv: schema.drinks.alcoholByVolume,
                packaging: schema.packaging.name,
                volume: schema.drinkFormats.volumeCc,
                type: schema.spiritTypes.name,
                agingContainer: schema.spiritAgingContainers.name,
                agingTimeMonths: schema.spirits.agingTimeMonths,
                country: schema.countries.name,
                region: schema.origins.region,
            })
            .from(schema.spirits)
            .innerJoin(schema.drinks, eq(schema.spirits.drinkId, schema.drinks.id))
            .innerJoin(schema.brands, eq(schema.drinks.brandId, schema.brands.id))
            .innerJoin(schema.drinkFormats, eq(schema.drinks.id, schema.drinkFormats.drinkId))
            .innerJoin(schema.packaging, eq(schema.drinkFormats.packagingId, schema.packaging.id))
            .innerJoin(schema.spiritTypes, eq(schema.spirits.spiritTypeId, schema.spiritTypes.id))
            .innerJoin(schema.spiritAgingContainers, eq(schema.spirits.agingContainerId, schema.spiritAgingContainers.id))
            // Origen efectivo del drink (prioriza drinks.origin_id)
            .leftJoin(schema.origins, eq(schema.origins.id, sql`COALESCE(${schema.drinks.originId}, ${schema.brands.originId})`))
            .leftJoin(schema.countries, eq(schema.origins.countryId, schema.countries.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)

        return c.json(
            {
                pagination: { page, limit, totalPages: Math.ceil(spirits.length / limit) },
                data: spirits.sort((a, b) => a.name.localeCompare(b.name)).slice(offset, offset + limit),
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

route.get('/spirits/:id', async (c) => {
    try {
        const id = c.req.param('id')

        const db = drizzle(c.env.DB, { schema })
        const spirits = await db
            .select({
                id: schema.spirits.drinkId,
                name: schema.drinks.name,
                brand: schema.brands.name,
                abv: schema.drinks.alcoholByVolume,
                packaging: schema.packaging.name,
                volume: schema.drinkFormats.volumeCc,
                type: schema.spiritTypes.name,
                agingContainer: schema.spiritAgingContainers.name,
                agingTimeMonths: schema.spirits.agingTimeMonths,
                country: schema.countries.name,
                region: schema.origins.region,
            })
            .from(schema.spirits)
            .innerJoin(schema.drinks, eq(schema.spirits.drinkId, schema.drinks.id))
            .innerJoin(schema.brands, eq(schema.drinks.brandId, schema.brands.id))
            .innerJoin(schema.drinkFormats, eq(schema.drinks.id, schema.drinkFormats.drinkId))
            .innerJoin(schema.packaging, eq(schema.drinkFormats.packagingId, schema.packaging.id))
            .innerJoin(schema.spiritTypes, eq(schema.spirits.spiritTypeId, schema.spiritTypes.id))
            .innerJoin(schema.spiritAgingContainers, eq(schema.spirits.agingContainerId, schema.spiritAgingContainers.id))
            // Origen efectivo del drink (prioriza drinks.origin_id)
            .leftJoin(schema.origins, eq(schema.origins.id, sql`COALESCE(${schema.drinks.originId}, ${schema.brands.originId})`))
            .leftJoin(schema.countries, eq(schema.origins.countryId, schema.countries.id))
            .where(eq(schema.spirits.drinkId, id))
            .limit(1)

        if (spirits.length === 0) {
            return c.json({ error: 'Spirit not found' }, 404)
        }

        return c.json(
            {
                data: spirits[0],
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

route.get('/spirit-types', async (c) => {
    try {
        const query = parseQuery(c.req.query())
        const pagination = paginationSchema.safeParse(query)
        if (pagination.error !== undefined) return c.json({ error: JSON.parse(pagination.error.message) }, 400)

        const { page, limit } = pagination.data
        const offset = (page - 1) * limit

        const db = drizzle(c.env.DB, { schema })
        const spiritTypes = await db
            .select({
                id: schema.spiritTypes.id,
                name: schema.spiritTypes.name,
                description: schema.spiritTypes.description,
            })
            .from(schema.spiritTypes)
            .orderBy(schema.spiritTypes.name)

        return c.json(
            {
                pagination: { page, limit, totalPages: Math.ceil(spiritTypes.length / limit) },
                data: spiritTypes.slice(offset, offset + limit),
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

route.get('/spirit-types/:id', async (c) => {
    try {
        const id = c.req.param('id')

        const db = drizzle(c.env.DB, { schema })
        const spiritTypes = await db
            .select({
                id: schema.spiritTypes.id,
                name: schema.spiritTypes.name,
                description: schema.spiritTypes.description,
            })
            .from(schema.spiritTypes)
            .where(eq(schema.spiritTypes.id, id))
            .limit(1)

        if (spiritTypes.length === 0) {
            return c.json({ error: 'Spirit type not found' }, 404)
        }

        return c.json(
            {
                data: spiritTypes[0],
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

route.get('/spirit-aging-containers', async (c) => {
    try {
        const query = parseQuery(c.req.query())
        const pagination = paginationSchema.safeParse(query)
        if (pagination.error !== undefined) return c.json({ error: JSON.parse(pagination.error.message) }, 400)

        const { page, limit } = pagination.data
        const offset = (page - 1) * limit

        const db = drizzle(c.env.DB, { schema })
        const spiritAgingContainers = await db
            .select({
                id: schema.spiritAgingContainers.id,
                name: schema.spiritAgingContainers.name,
            })
            .from(schema.spiritAgingContainers)
            .orderBy(schema.spiritAgingContainers.name)

        return c.json(
            {
                pagination: { page, limit, totalPages: Math.ceil(spiritAgingContainers.length / limit) },
                data: spiritAgingContainers.slice(offset, offset + limit),
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

route.get('/spirit-aging-containers/:id', async (c) => {
    try {
        const id = c.req.param('id')

        const db = drizzle(c.env.DB, { schema })
        const spiritAgingContainers = await db
            .select({
                id: schema.spiritAgingContainers.id,
                name: schema.spiritAgingContainers.name,
            })
            .from(schema.spiritAgingContainers)
            .where(eq(schema.spiritAgingContainers.id, id))
            .limit(1)

        if (spiritAgingContainers.length === 0) {
            return c.json({ error: 'Spirit aging container not found' }, 404)
        }

        return c.json(
            {
                data: spiritAgingContainers[0],
            },
            200
        )
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500)
    }
})

export default route
