export function generatePriceBins(products) {
  if (!products.length) return []
  
  const minPrice = Math.floor(Math.min(...products.map(p => p.price)))
  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)))
  
  const binCount = Math.min(10, Math.max(5, Math.floor(products.length / 20)))
  const binSize = Math.ceil((maxPrice - minPrice) / binCount)
  
  const bins = Array.from({ length: binCount }, (_, i) => {
    const start = minPrice + i * binSize
    const end = start + binSize
    return {
      min: start,
      max: end,
      label: `${start.toLocaleString()} - ${end.toLocaleString()}₽`,
      count: 0
    }
  })
  
  products.forEach(product => {
    const price = product.price
    const binIndex = Math.min(
      binCount - 1, 
      Math.floor((price - minPrice) / binSize)
    )
    bins[binIndex].count++
  })
  
  return bins
}