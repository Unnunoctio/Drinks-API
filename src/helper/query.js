export const parseQuery = (c) => {
  return Object.fromEntries(
    Object.entries(c.req.query()).map(([key, value]) => {
      if (value === 'true' || value === 'false') return [key, value === 'true']
      const num = Number(value)
      return [key, !isNaN(num) && value !== '' ? num : value]
    })
  )
}
