import { useCallback, useState, useEffect } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  onImageClear?: () => void
  clearTrigger?: number
  disabled?: boolean
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export function ImageUploader({ onImageSelect, onImageClear, clearTrigger, disabled }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, or WebP)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    onImageSelect(file)
  }, [onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled) return
    
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setIsDragging(false)
  }, [disabled])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile, disabled])

  const clearPreview = useCallback((emitEvent = true) => {
    setPreview(null)
    // Only notify parent if this wasn't triggered by the parent
    if (emitEvent) {
      onImageClear?.()
    }
  }, [onImageClear])

  // Clear preview when clearTrigger changes
  useEffect(() => {
    if (clearTrigger !== undefined && clearTrigger > 0) {
      console.log('Clear trigger detected, clearing preview')
      clearPreview(false) // Don't emit event back
    }
  }, [clearTrigger, clearPreview])

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative overflow-hidden border border-gray-300 bg-white p-md">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-80 object-contain"
          />
          {!disabled && (
            <button
              onClick={() => clearPreview(true)}
              className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative w-full max-w-lg mx-auto p-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
        isDragging 
          ? "border-accent bg-gray-50" 
          : "border-gray-500 hover:border-gray-700 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center gap-md text-center">
        <div className="p-4 bg-charcoal/10">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-accent" />
          ) : (
            <Upload className="w-8 h-8 text-accent" />
          )}
        </div>
        <div>
          <p className="text-h4 uppercase-mds letter-spacing-tight text-black">
            {isDragging ? 'Drop your image here' : 'Upload a screenshot'}
          </p>
          <p className="mt-1 text-small text-gray-700">
            Drag and drop or click to browse
          </p>
          <p className="mt-2 text-small text-gray-700">
            Supports PNG, JPG, JPEG, WebP
          </p>
        </div>
      </div>
    </div>
  )
}
