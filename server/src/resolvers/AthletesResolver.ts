import { UserInputError } from "apollo-server-errors"
import { Resolver, Query, ObjectType, Field, Args, ArgsType, Int, InputType } from "type-graphql"
import athletesData from "../data/rushing.json"
import { Edge, PageInfo } from "../util/connectionTypes"
import { SortValues } from "../util/types"

@ObjectType()
export class Athlete {
  @Field({ description: "Player's name"})
  name: string
  @Field({ description: "Player's team abbreviation" })
  team: string
  @Field({ description: "Player's position" })
  position: string
  @Field({ description: "Rushing attempts" })
  attempts: number
  @Field({ description: "Average rushing attempts per game" })
  attemptsPerGame: number // decimal
  @Field({ description: "Toal rushing yards" })
  totalYards: number
  @Field({ description: "Average rushing yards per attempt" })
  averageYardsPerAttempt: number // decimal
  @Field({ description: "Average rushing yards per game" })
  yardsPerGame: number
  @Field({ description: "Total rushing touchdowns" })
  touchdowns: number
  @Field({ description: "Longest rush (T means a touchdown occured)" })
  longest: string
  @Field({ description: "Rushing first downs" })
  firstDowns: number
  @Field({ description: "Rushing first down percentage" })
  firstDownsPercentage: number // decimal ?
  @Field({ description: "Total times rushed 20+ yards" })
  twentyPlusYards: number
  @Field({ description: "Total times rushed 40+ yards" })
  fourtyPlusYards: number
  @Field({ description: "Rushing fumbles" })
  fumbles: number
}

@InputType()
class SearchParamsInput {
  // Filtering
  @Field(() => String, { nullable: true })
  playerName?: string | null

  // Sorting
  @Field(() => String, { nullable: true })
  totalYards?: SortValues
  @Field(() => String, { nullable: true })
  longest?: SortValues
  @Field(() => String, { nullable: true })
  touchdowns?: SortValues
}

@ArgsType()
class AthletesResolverArgs {
  @Field(() => Int, { nullable: true })
  first?: number | null
  @Field(() => String, { nullable: true })
  after?: string | null
  
  @Field(() => SearchParamsInput, { nullable: true })
  searchParams?: SearchParamsInput | null
}

@ObjectType()
export class AthletesResolverResponse {
  @Field(() => [Edge])
  edges: Edge[]
  @Field()
  pageInfo: PageInfo
}

@Resolver(() => String)
export class AthleteResolver {
  @Query(() => AthletesResolverResponse)
  athletes(@Args() args: AthletesResolverArgs): AthletesResolverResponse {
    const { searchParams } = args
    const allAthletes: Athlete[] = mapPlayerDataKeys()
    const formattedAthletes = filterAndSortAthletes(allAthletes, searchParams)

    // default first
    let first = 25
    if (args.first) {
      const minValue = 1
      const maxValue = 25
      if (args.first < minValue || args.first > maxValue) {
        throw new UserInputError(`Invalid limit value (min: ${minValue}, max: ${maxValue})`)
      }
      first = args.first
    }

    // default cursor
    let after = 0
    if (args.after) {
      const index = formattedAthletes.findIndex(athlete => athlete.name === args.after)
      if (index === -1) {
        throw new UserInputError(`Invalid after value: cursor not found.`)
      }
      after = index + 1
      if (after === formattedAthletes.length) {
        throw new UserInputError(`Invalid after value, no items after provided cursor.`)
      }
    }

    const nextAthletes = formattedAthletes.slice(after, after + first)
    const lastAthlete = nextAthletes[nextAthletes.length - 1]

    const noAthletes = nextAthletes.length === 0

    return {
      pageInfo: {
        endCursor: noAthletes ? "" : lastAthlete.name,
        hasNextPage: after + first < formattedAthletes.length,
      },
      edges: nextAthletes.map(athlete => ({
        cursor: athlete.name,
        node: athlete
      }))
    }
  }
}

export function mapPlayerDataKeys() {
  return athletesData.map(athlete => ({
    name: athlete.Player,
    team: athlete.Team,
    position: athlete.Pos,
    attempts: athlete.Att,
    attemptsPerGame: athlete["Att/G"],
    totalYards: typeof athlete.Yds === "string" ? Number(athlete.Yds.replace(",", "")) : athlete.Yds,
    averageYardsPerAttempt: athlete.Avg,
    yardsPerGame: athlete["Yds/G"],
    touchdowns: athlete.TD,
    longest: athlete.Lng,
    firstDowns: athlete["1st"],
    firstDownsPercentage: athlete["1st%"],
    twentyPlusYards: athlete["20+"],
    fourtyPlusYards: athlete["40+"],
    fumbles: athlete.FUM,
  } as Athlete))
}

export function filterAndSortAthletes(athletes: Athlete[], searchParams?: SearchParamsInput | null) {
  if (!searchParams) return athletes
  return athletes
    .filter(athlete => {
      if (!searchParams?.playerName) {
        return true
      }
      return athlete.name.toLowerCase().includes(searchParams.playerName.toLowerCase())
    })
    .sort((a, b) => {
      if (searchParams?.totalYards) {
        // Sort by Total Yards
        return searchParams.totalYards === "ASC" 
          ? a.totalYards - b.totalYards 
          : b.totalYards - a.totalYards
      } else if (searchParams?.longest) {
        // Sort by Longest Rush
        return searchParams.longest === "ASC"
          ? Number(a.longest.replace("T","")) - Number(b.longest.replace("T",""))
          : Number(b.longest.replace("T","")) - Number(a.longest.replace("T",""))
      } else if (searchParams?.touchdowns) {
        // Sort by Total Touchdowns
        return searchParams.touchdowns === "ASC"
          ? a.touchdowns - b.touchdowns
          : b.touchdowns - a.touchdowns
      }

      // Default sort by name
      return a.name < b.name ? -1 : 1
    })
}
