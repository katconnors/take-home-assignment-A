export interface queryData {
  id: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  status: string
  formDataId: string
}

export interface initialQueryData {
  title: string
  description: string | null
  formDataId: string
}

export interface updatedQueryData {
  formDataId: string
  description: string | null
  status?: 'RESOLVED'
}
