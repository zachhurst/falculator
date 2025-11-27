import { useCallback, useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
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
    
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearPreview = useCallback(() => {
    setPreview(null)
  }, [])

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative rounded-lg overflow-hidden border border-border bg-card shadow-sm">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto max-h-80 object-contain"
          />
          {!disabled && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-foreground" />
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
        "relative w-full max-w-lg mx-auto p-8 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50 hover:bg-secondary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            {isDragging ? 'Drop your image here' : 'Upload a screenshot'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop or click to browse
          </p>
          <p className="mt-2 text-xs text-muted">
            Supports PNG, JPG, JPEG, WebP
          </p>
        </div>
      </div>
    </div>
  )
}
