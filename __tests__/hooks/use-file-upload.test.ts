import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '@/hooks/use-file-upload'

describe('useFileUpload Hook', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFileUpload())
    
    expect(result.current.selectedFile).toBeNull()
    expect(result.current.previewUrl).toBe('')
    expect(result.current.error).toBe('')
  })

  it('validates file size', () => {
    const { result } = renderHook(() => useFileUpload())
    
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    act(() => {
      result.current.handleFileSelect(largeFile)
    })

    expect(result.current.error).toContain('trop volumineux')
  })

  it('validates file type', () => {
    const { result } = renderHook(() => useFileUpload())
    
    const invalidFile = new File(['content'], 'file.txt', {
      type: 'text/plain',
    })

    act(() => {
      result.current.handleFileSelect(invalidFile)
    })

    expect(result.current.error).toContain('Format non supporté')
  })

  it('clears file and preview URL', () => {
    const { result } = renderHook(() => useFileUpload())
    
    const validFile = new File(['content'], 'image.jpg', {
      type: 'image/jpeg',
    })

    act(() => {
      result.current.handleFileSelect(validFile)
    })

    expect(result.current.selectedFile).toBe(validFile)

    act(() => {
      result.current.clearFile()
    })

    expect(result.current.selectedFile).toBeNull()
    expect(result.current.previewUrl).toBe('')
  })
})
