import { useCallback } from 'react'
import { authApi } from '../lib/api'

/**
 * Handles avatar upload and removal.
 * Extracted from App.jsx to keep profile concerns in one place.
 */
export function useProfileActions({ setProfilePhoto, refreshInsights }) {
  const handleProfilePhotoChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = async () => {
      const maxSize = 200
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height

      if (w > maxSize || h > maxSize) {
        if (w > h) {
          h = Math.round((h * maxSize) / w)
          w = maxSize
        } else {
          w = Math.round((w * maxSize) / h)
          h = maxSize
        }
      }

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const resized = canvas.toDataURL('image/jpeg', 0.8)

      setProfilePhoto(resized)

      try {
        await authApi.updateAvatar({ avatar: resized })
        await refreshInsights()
      } catch {
        // Avatar saved locally even if server fails
      }
    }
    img.src = URL.createObjectURL(file)
  }, [setProfilePhoto, refreshInsights])

  const handleRemovePhoto = useCallback(async () => {
    setProfilePhoto('')
    try {
      await authApi.updateAvatar({ avatar: '' })
      await refreshInsights()
    } catch {
      // Ignore
    }
  }, [setProfilePhoto, refreshInsights])

  return { handleProfilePhotoChange, handleRemovePhoto }
}
