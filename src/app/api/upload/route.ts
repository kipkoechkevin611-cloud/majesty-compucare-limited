import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'products'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const sanitize = (v?: string) => v?.trim().replace(/^['"]|['"]$/g, '')
    const cloudName = sanitize(process.env.CLOUDINARY_CLOUD_NAME)
    const apiKey = sanitize(process.env.CLOUDINARY_API_KEY)
    const apiSecret = sanitize(process.env.CLOUDINARY_API_SECRET)

    const looksPlaceholder = (s?: string) => !!s && /(your[_-]?cloud[_-]?name|your[_-]?api[_-]?key|your[_-]?api[_-]?secret)/i.test(s)

    if (!cloudName || !apiKey || !apiSecret || looksPlaceholder(cloudName) || looksPlaceholder(apiKey) || looksPlaceholder(apiSecret)) {
      // Fallback immediately to local upload when Cloudinary isn't properly configured
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      const originalName = (file as any)?.name || `upload-${Date.now()}`
      const safeName = `${Date.now()}-${originalName}`.replace(/[^a-z0-9._-]/gi, '_')
      const target = path.join(uploadsDir, safeName)
      await fs.writeFile(target, buffer)
      return NextResponse.json({ url: `/uploads/${safeName}`, hint: 'Using local upload fallback. Configure Cloudinary in .env for CDN hosting.' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const originalName = (file as any)?.name || `upload-${Date.now()}`

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
      return NextResponse.json({ url: (result as any).secure_url })
    } catch (cloudErr: any) {
      // Fallback: save locally for development if Cloudinary rejects (e.g., disabled cloud_name)
      const msg = String(cloudErr?.message || cloudErr?.error || '').toLowerCase()
      if (msg.includes('cloud_name is disabled')) {
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          await fs.mkdir(uploadsDir, { recursive: true })
          const safeName = `${Date.now()}-${originalName}`.replace(/[^a-z0-9._-]/gi, '_')
          const target = path.join(uploadsDir, safeName)
          await fs.writeFile(target, buffer)
          return NextResponse.json({ url: `/uploads/${safeName}` })
        } catch (fsErr) {
          console.error('Local upload fallback failed:', fsErr)
        }
      }
      throw cloudErr
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    const raw = error as any
    const message = raw?.message || raw?.error?.message || raw?.error || 'Failed to upload image'
    let hint = ''
    const lc = String(message).toLowerCase()
    if (lc.includes('cloud_name is disabled')) {
      hint = 'Your Cloudinary cloud_name is disabled. Verify account status and check CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.'
    } else if (lc.includes('unknown api key') || lc.includes('invalid api key')) {
      hint = 'Invalid Cloudinary API key. Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.'
    }
    return NextResponse.json({ error: String(message), hint: hint || undefined }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    // Local uploads deletion support
    const localIdx = url.indexOf('/uploads/')
    if (localIdx !== -1) {
      const rel = url.slice(localIdx).replace(/^\/+/, '') // e.g., 'uploads/filename.jpg'
      if (!rel.startsWith('uploads/')) {
        return NextResponse.json({ error: 'Invalid local path' }, { status: 400 })
      }
      const filePath = path.join(process.cwd(), 'public', rel)
      try {
        await fs.unlink(filePath)
      } catch {}
      return NextResponse.json({ success: true })
    }

    // Extract public ID from Cloudinary URL and delete
    const publicId = url.split('/').pop()?.split('.')[0]
    if (!publicId) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }
    await cloudinary.uploader.destroy(`products/${publicId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
