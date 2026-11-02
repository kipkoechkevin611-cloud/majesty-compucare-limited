type OfflineProduct = {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  brand: string
  price: number
  salePrice?: number
  stock: number
  images: string[]
  featured: boolean
  status: 'ACTIVE'
  category: { id: string; name: string; slug: string }
}

const laptops = { id: 'offline-laptops', name: 'Laptops', slug: 'laptops' }

const product = (
  slug: string,
  name: string,
  brand: string,
  price: number,
  image: string,
  salePrice?: number,
): OfflineProduct => ({
  id: `offline-${slug}`,
  slug,
  name,
  description: `${name} - reliable performance for work, study, and everyday business use.`,
  shortDescription: 'Clean-tested laptop with dependable performance.',
  brand,
  price,
  salePrice,
  stock: 6,
  images: [`/images/products/${image}`],
  featured: true,
  status: 'ACTIVE',
  category: laptops,
})

export const offlineProducts: OfflineProduct[] = [
  product('hp-elitebook-840-g8', 'HP EliteBook 840 G8', 'HP', 58000, 'hp-elitebook-840-g8.png', 54500),
  product('hp-elitebook-1040-g7', 'HP EliteBook 1040 G7', 'HP', 68000, 'hp-elitebook-1040-g7.png'),
  product('dell-latitude-5400', 'Dell Latitude 5400', 'Dell', 44000, 'dell-latitude-5400.png', 41500),
  product('dell-latitude-7400', 'Dell Latitude 7400', 'Dell', 62000, 'dell-latitude-7400.png'),
  product('dell-xps-13-7390', 'Dell XPS 13 7390', 'Dell', 78000, 'dell-xps-13-7390.png', 73500),
  product('lenovo-thinkpad-t480s', 'Lenovo ThinkPad T480s', 'Lenovo', 49000, 'lenovo-thinkpad-t480s.png'),
  product('lenovo-thinkpad-t490s', 'Lenovo ThinkPad T490s', 'Lenovo', 56000, 'lenovo-thinkpad-t490s.png', 52500),
  product('lenovo-thinkpad-x1-carbon', 'Lenovo ThinkPad X1 Carbon', 'Lenovo', 72000, 'lenovo-thinkpad-x1-carbon.png'),
  product('apple-macbook-air-2017', 'Apple MacBook Air 2017', 'Apple', 49000, 'apple-macbook-air-2017.png'),
  product('apple-macbook-pro-15-2018', 'Apple MacBook Pro 15-inch 2018', 'Apple', 92000, 'apple-macbook-pro-15-2018.png', 87500),
  product('hp-zbook-14-g7', 'HP ZBook 14 G7', 'HP', 85000, 'hp-zbook-14-g7.png'),
  product('dell-precision-7550', 'Dell Precision 7550', 'Dell', 105000, 'dell-precision-7550.png', 99000),
]

export const offlineCategories = [laptops]

export function findOfflineProduct(key: string) {
  return offlineProducts.find((item) => item.id === key || item.slug === key)
}
