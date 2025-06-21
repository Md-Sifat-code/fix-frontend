interface Project {
  id: number
  title: string
  country: string
  year: number
  type: string
}

interface Continent {
  name: string
  path: string
}

interface WorldProjectMapProps {
  projects: Project[]
}

const continents: Continent[] = [
  { name: 'North America', path: 'M48,89l-3,1l-1,2l1,2l-1,1l-2-1l-2,1v2l-5,2l-3,3h-2l-3,2l-4,0l-2,1l-3-2l-3,1l-2-1l-1,1l-3-1l-6,1l-1-2l-2,1l-3-1l1-1l-1-1l1-2h-2l-3-1l2-2l-1-1l1-1h-1l1-3h2v-2l-1-1h1v-1h-1l1-1l-2-1l-1-2l-2-1l1-1l-1-2h1v-1l-1-1l3-1v-1h-1l1-1h2l1-1h1l-1-1l1-1h1l2-1v-1h-1l-1-1l-1-1l-2,1l-1-1l1-2l1,1h1l1-2l1,1l2-1v-1l1,1h1l1-1h1l1,1l1-1v-1h-2l1-1h-1l1-1h1v1h1l1-1l-1-1h1l1,1h1l-1,1h1l2-1v-1h1v-1h-1v-1h1v-1h2v-1h1l1,1l2-1h1v-1h-1l1-1h2l3,1v-1h3l2,1h1v-1h1l1,1h2l1,2l1-1l1,1h1l-1,1h1l2-1v2l2,2v1h1l-1,1h2l-1,1h1v1h-1l-1,1h-1l1,1h-2l-2,1v1l1,1h-1l-1,1l1,1h-1v1h-1l-1,2h-1v2h1v1h-1l-1,1l1,1h-2v1h1v1h-1v1h1l-1,2l-1-1v1l-3,3l1,1l-1,1h1l-1,1h-1l1,2h-1v1h1v3l-1-1v1l-1,1h-1v-1l-1,2l-2-1v1h-2l1,2l-1,1l1,1l-1,1h-1l-1,1l1,1h-1l1,1h-2l1,1h1v1h-2l-2,1v1h-1l1,1h-1Z' },
  { name: 'South America', path: 'M120,200l-1,3l1,2h-1l-1,2h-1v2l1,1h-1l-1,3l-2,2l1,1l-2,3l-2,1l1,3l-2,2v2l-1,2l-3,1l-3,3l-1-1l-2,1l-3-1l-3,1l1,3l-2,2l-2-2l-2,2l-3-2l-2-2h-2l-5-4l-3-1l-2-3h-3l-3-5l2-1l-2-2l1-3l-1-2l1-4l-2-2l0-3l0-3l3-3l-1-2l2-2l-3-1l0-3l-1-2l1-1l-3-2l-1-3l1-1l-1-2l2-1l1-3l-2-2l2-1l1-3l4,1l1-1l3,1h0l3,1l1-1h4l2-2l2,2h1l1-3l2-2l3,1l3-2l2-2l2,1l1-2h2l-1-2l2-1l3,2l2-1l2,1l-1,1l3,1l3-1l2,2l1-1l0,2l2,2l-2,2l3,3v2l-1,1l1,1l-1,1l1,2l-3,1l1,2h-1l-1,2l-1,1l1,1l-1,1l1,1l-2,1v2l-2,2Z' },
  { name: 'Europe', path: 'M203,77l1,1l-2,1v-1l-4,1v2l-1-1l-1,1h-1l1,2h-1v1h-1v-1l-1,1l-1-1v1l-1,1h-1v1l-2-1v1h-4v1l-2,1v1h-1l-1-1l-1,1h-1v1l-1-1l-1,1h-1l1,1h-2l-1-1h-1l-1,1l-1-1h-3v-1l-1,1h-1l-1-1l-2,1v1l-1-1h-2l-2-1h-2l-2,1v-1h-1v-1h-1v1l-2-1h-3l-1-1l-3,1v-1h-1l1-1h-1l-3,1v-1h-1l-1,1v-1h-1l-1,1l-2-1h-3l-1-1l1-1h-1v-1l-1,1l-1-2l-1,1l-1-1l1-1h-2v-1h1v-1h-1l1-1h2v1h1v-2l2,1l2-2l1,1h1v-1h1l1,1l1-2h1v1l1-1h2l1,1h1v-1l1,1l2-1l-1-1h1l-1-1h1l1,1h1v1h1l-1-2h1v1h1l1-1l1,1v-1l1,1l2-2l1,1v-1h1l-1-1h2l-1-1h1l1,1v-1h-1v-1h1v1h1v-1h-1v-1h3v-1l2,1v-1h1l-1-1h1l1,1h1l1-1h-1l1-1h1l-1-1h3l-1-1h1l1,1h1l1-2h1v-1h-2l1-1h1l2,1h1l-1,1h1l-1,1h1l1-1v1l1-1v1h1l-1,1h1v1h-1l1,1h-1v1h1v-1h1l-1,1h2v1h-3v1h1l-1,1h2v1h1v-2h1v1h1l1,2h-1v1h-2l1,1h-1l-1,1h2l2,1v1h-1l1,1h-2v1h1v1h1l-2,1h-1l1,1h-1Z' },
  { name: 'Africa', path: 'M210,139v3l2,1l1,3h-1l-1-2h-1v-1l-2-1l1-2l-1-1h2Zm21-15l-1-1l1-1l2,1l3,3l-1,1l1,1v2h-1l-1,1l1,1l-1,1h-1v2l2,2l1,2l2,1v1l1,2l-1,1l1,1l-1,2h-1v-2l-1-1v1l-1,1l1,1l-1,1l-1-1l-2,1l-1-2h-1v-2l-2-2v-1h-2l-1,1l-2-1l1-2h1v-1l-1-1l1-1l-2-2l1-2l-1-1l1-1h2l1,1h2v-1l1-3l1-1l2,1v-2Z' },\
  { name: 'Asia\', path: \'M253,78l1,1h1l1,1l2-1l1,1h1v-1h1v2h1v1l-1,1h-1l-1,1l1,1h-1v1h1l-1,1h-2l-1,2h-1v-1l-1,1l-1-1l-1,2l-1-1l-1,1l-2-1v1h-1l1,2h-1l-1-1v1l-1-1l-1,1l1,1l-2,1v2h-1v-1l-1,1v2h-1v-1h-2l-1,3h-1l1,1h-1l-1-1v1l-2,1v1h-1v-1l-1,1l-1-1v1l-3,1v2l-2-1v1h-1v-1h-1v-2l-1,1l-1-1l-2,2v1h-1v-1l-2,1v-1h-1v-1l-1,1v-2h1v-1l-2-2l1-2h2v1h2l-1-1h1v-1h-1l1-1l-1-1h1l-1-1h1l1,1l1-1h-1l1-2h1v1h1l1-1l-1-1h1l1,1l-1-3h-1l1-1h-2v-1h3v1h1l-1-1h2l-1-1h1l1,1h1l2-1h1l1,1h1l1-2h1l-1-1h1l1,1h2v-1l1,1l1-1h1l1,1l2-1h1v1h3l1-1h1l1,1h-1v1h1v-1h1l1,1l3-1v-1h-1v-1h1l-1-1h3v-1h1l-1-1h2l-1-1h1v-1h1l2,1v-1h1l-1-1h2l3,1v-1h-1l1-1h1l3,1l-1-1h2l1,1h1l-1,1h1v-1h1l1,1l-1,1h2v-1h1l-1-1h1l1,1h1l1-1l1,1l1-1l2,1l-1,1h1l-1,1h1v-1h1v1h-1l1,1h1v1h-2v1h1v1h1l-1,1h1l-2,1h1v1h-1l1,1h-1l1,1h-2v1h1v1h-1l1,1h-1v1h1v1h2v1h-1l1,1h-1v1h-1l1,1h-1v1h1l-1,1h1l-2,1h1v1h-2v1h1l-1,1h1l-1,1h-1l1,1l-2,1h1v2h-1v1h1v1h-1v1l-1-1v1h-3l-2-1v-3l-1-1l1-3l-2-2v-1l-3-1v-1h-1l1-2l-1-1l1-1l-2-1l1-3h-1v1l-1-1l-1,1l-1-1h-1v-1l-1,1v-1h-1l-1-2l-2,1v-2l-1,1l-3-1v-1l-1,1l-1-2l-1,1v-1h-1v1l-1-1v1l-2-2v-1l-2,1v-1h-1l1-1l-1-1l-2,1v-1h-1v-1l-1,1l-1-1l-3,1v-1l-1,1l-1-1l-1,1h-1l-1-1l-2,1v-1h-1l-1-1l-1,1l-2-1h-3l-2-1h-1l-1-1l-1,1l-2-1h-3v-1l-4,1v-1l-3,1l-1-1h-2l-1,1h-4l-2,1l-1-1l-2,1l-3-1l-2,1l-2-1h-2l-2,1l-1-1h-1v-1l1-1l-1-1h1v-1l-1-1h1v-1h-1v-1h-1v-1h1v-1l-2-1v-1h-1v1l-1-1h-1l1-1l-2-1h3v-1l1,1l2-1l-1-1h1l1,1l2-1h1v1h1l1-2l3,1v-1h1l1,1h2v-1l1,1l2-1l-1-1h1l1,1l1-1l1,1l1-1h1l1,1h1v-1h1l1,1l2-1h2l1,1l1-1h1v1l2-1h1l1,1l1-1h3v-1h-1v-1h1v1h1v-1l1,1h1v-1h1l-1-1h1v-1h-1v-1h1l1,1v-1h1v-1l-1-1h1v-1h1l1,1l1-
