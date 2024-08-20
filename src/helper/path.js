export const generatePath = (value) => {
  return value.toLowerCase().replaceAll(/[.°+]/g, '').replaceAll(' ', '-').replaceAll('/', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
