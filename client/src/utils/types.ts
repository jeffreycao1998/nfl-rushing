export type Athlete = {
  name: string
  team: string
  position: string
  attempts: number
  attemptsPerGame: number
  totalYards: number
  averageYardsPerAttempt: number
  yardsPerGame: number
  touchdowns: number
  longest: string
  firstDowns: number
  firstDownsPercentage: number
  twentyPlusYards: number
  fourtyPlusYards: number
  fumbles: number
}

export interface Edge {
  cursor: string
  node: Athlete
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

export type SortKeys = "totalYards" | "longest" | "touchdowns"
export type SortValues = "ASC" | "DSC" | null

export interface SearchParams {
  totalYards?: SortValues
  touchdowns?: SortValues
  longest?: SortValues
  playerName?: string | null
}