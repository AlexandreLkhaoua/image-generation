import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '@/hooks/use-file-upload'

describe('useFileUpload Hook', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFileUpload())
    
    expect(result.current.selectedFiles).toEqual([])
    expect(result.current.error).toBe('')
  })

  it('validates file size', () => {
    const { result } = renderHook(() => useFileUpload())
    
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    const event = {
      target: {
        files: [largeFile],
        value: ''
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>

    act(() => {
      result.current.handleFileInput(event)
    })

    expect(result.current.error).toContain('trop volumineux')
  })

  it('validates file type', () => {
    const { result } = renderHook(() => useFileUpload())
    
    const invalidFile = new File(['content'], 'file.txt', {
      type: 'text/plain',
    })

    const event = {
      target: {
        files: [invalidFile],
        value: ''
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>

    act(() => {
      result.current.handleFileInput(event)
    })

    expect(result.current.error).toContain('Format non supporté')
  })

  it('clears files and preview URLs', () => {
    const { result } = renderHook(() => useFileUpload())
    
    const validFile = new File(['content'], 'image.jpg', {
      type: 'image/jpeg',
    })

    const event = {
      target: {
        files: [validFile],
        value: ''
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>

    act(() => {
      result.current.handleFileInput(event)
    })

    expect(result.current.selectedFiles.length).toBe(1)
    expect(result.current.selectedFiles[0].file).toBe(validFile)

    act(() => {
      result.current.clearFiles()
    })

    expect(result.current.selectedFiles).toEqual([])
    expect(result.current.error).toBe('')
  })
})
