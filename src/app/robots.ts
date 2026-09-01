import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/', '/checkout/', '/cart/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
