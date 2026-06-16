import { v2 as cloudinary } from 'cloudinary'

const sanitize = (v?: string) => v?.trim().replace(/^['"]|['"]$/g, '')
const CLOUD_NAME = sanitize(process.env.CLOUDINARY_CLOUD_NAME)
const API_KEY = sanitize(process.env.CLOUDINARY_API_KEY)
const API_SECRET = sanitize(process.env.CLOUDINARY_API_SECRET)
const UPLOAD_PRESET = sanitize(process.env.CLOUDINARY_UPLOAD_PRESET) || 'ml_default'

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

export default cloudinary

export async function uploadImage(file: File, folder: string = 'products') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image')
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export async function deleteImage(publicId: string) {
  try {
    const response = await cloudinary.api.delete_resources([publicId], {
      type: 'upload',
      resource_type: 'image',
    })
    return response
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}
