export interface Project {
  id: string
  name: string
  description: string
  images: string[]
  location: string
  continent: string
  year: number
  climate: string
  style: string
  buildingType: string
  tags: string[]
  approved: boolean
  title: string
  country: string
  type: string
  stage: "inquiry" | "bidding" | "active" | "completed"
  lat: number
  lng: number
  Photographer: string
}
