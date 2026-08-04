export const siteUrl = 'https://www.majestycompucarelimited.com'

export const siteConfig = {
  name: 'Majesty Compucare Limited',
  shortName: 'Majesty Compucare',
  tagline: 'Your Trusted Technology Partner in Kenya',
  description:
    'Majesty Compucare Limited is a trusted ICT solutions provider in Kenya. We sell laptops, desktops, printers, CCTV, networking equipment, and accessories, plus offer computer repair, printer repair, CCTV installation, and IT support services.',
  keywords: [
    'laptops Kenya',
    'computers Nakuru',
    'computers Kisumu',
    'printers Kenya',
    'CCTV installation',
    'networking equipment',
    'computer repair',
    'laptop repair',
    'IT support Kenya',
    'Majesty Compucare',
  ],
  logo: `${siteUrl}/logo.png`,
  favicon: `${siteUrl}/favicon.ico`,
  email: 'sales.compucare111@gmail.com',
  phones: {
    nakuru: '+254716000367',
    kisumu: '+254111543714',
  },
  whatsapp: {
    nakuru: '254716000367',
    kisumu: '254111543714',
  },
  addresses: {
    nakuru: 'Nyakinyua Building, Kangei, Nakuru, Kenya',
    kisumu: 'Mega Plaza, Ground Floor, Oginga Odinga Street, Kisumu, Kenya',
  },
  social: {
    facebook: 'https://www.facebook.com/majestycompucare',
    twitter: 'https://twitter.com/majestycompucare',
    instagram: 'https://www.instagram.com/majestycompucare',
    linkedin: 'https://www.linkedin.com/company/majesty-compucare-limited',
  },
  hours: 'Mo-Fr 08:00-18:00, Sa 09:00-16:00',
  geo: {
    nakuru: {
      latitude: -0.3031,
      longitude: 36.07,
    },
    kisumu: {
      latitude: -0.1022,
      longitude: 34.7617,
    },
  },
}

export function buildJsonLd(type: 'organization' | 'localBusiness' | 'website' | 'breadcrumb' | 'product', data?: Record<string, any>) {
  if (type === 'organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteUrl,
      logo: siteConfig.logo,
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: [siteConfig.phones.nakuru, siteConfig.phones.kisumu],
      sameAs: Object.values(siteConfig.social).filter(Boolean),
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: siteConfig.phones.nakuru,
          contactType: 'sales',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
        {
          '@type': 'ContactPoint',
          telephone: siteConfig.phones.kisumu,
          contactType: 'customer service',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
      ],
    }
  }

  if (type === 'localBusiness') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ElectronicsStore',
      name: siteConfig.name,
      image: siteConfig.logo,
      url: siteUrl,
      telephone: siteConfig.phones.nakuru,
      email: siteConfig.email,
      description: siteConfig.description,
      priceRange: '$$$',
      address: [
        {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.addresses.nakuru,
          addressLocality: 'Nakuru',
          addressCountry: 'KE',
        },
        {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.addresses.kisumu,
          addressLocality: 'Kisumu',
          addressCountry: 'KE',
        },
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.geo.nakuru.latitude,
        longitude: siteConfig.geo.nakuru.longitude,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '16:00',
        },
      ],
      sameAs: Object.values(siteConfig.social).filter(Boolean),
    }
  }

  if (type === 'website') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/products?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }
  }

  if (type === 'breadcrumb') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data?.items || []).map((item: { name: string; path: string }, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.path.startsWith('http') ? item.path : `${siteUrl}${item.path}`,
      })),
    }
  }

  if (type === 'product' && data) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      image: data.image ? (Array.isArray(data.image) ? data.image : [data.image]) : [],
      description: data.description,
      brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
      sku: data.sku || data.id,
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/products/${data.id}`,
        priceCurrency: 'KES',
        price: data.price?.toString(),
        priceValidUntil: data.priceValidUntil,
        availability: data.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    }
  }
}

export function mergeMetadata(
  title: string,
  description: string,
  options: {
    path?: string
    image?: string
    ogType?: string
    noIndex?: boolean
  } = {}
) {
  const url = options.path ? `${siteUrl}${options.path}` : siteUrl
  const image = options.image || `${siteUrl}/logo.png`

  return {
    title,
    description,
    keywords: siteConfig.keywords.join(', '),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_KE',
      type: options.ogType || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-32x32.png',
      apple: '/apple-touch-icon.png',
      other: [
        { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', url: '/site.webmanifest' },
      ],
    },
  }
}
