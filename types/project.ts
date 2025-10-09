export interface Project {
  id: string
  user_id: string
  created_at: string
  input_image_url: string
  output_image_url: string | null
  prompt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface GenerateImageRequest {
  image: File
  prompt: string
}

export interface GenerateImageResponse {
  success: boolean
  projectId?: string
  outputImageUrl?: string
  error?: string
}