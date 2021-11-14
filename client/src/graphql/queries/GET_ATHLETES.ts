import { gql } from "@apollo/client"
import { Edge, PageInfo, SearchParams } from "../../utils/types"

export const GET_ATHLETTES = gql`
  query athletes($first: Int, $after: String, $searchParams: SearchParamsInput) {
    athletes(first: $first, after: $after, searchParams: $searchParams) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          name
          team
          position
          attempts
          attemptsPerGame
          totalYards
          averageYardsPerAttempt
          yardsPerGame
          touchdowns
          longest
          firstDowns
          firstDownsPercentage
          twentyPlusYards
          fourtyPlusYards
          fumbles
        }
      }
    }
  }
`

export interface GetAthletesQueryData {
  athletes: {
    edges: Edge[]
    pageInfo: PageInfo
  }
}

export interface GetAthletesQueryVariables {
  first?: number | null
  after?: string | null
  searchParams?: SearchParams | null
}