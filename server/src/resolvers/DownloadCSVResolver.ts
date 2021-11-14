import { InputType, Field, ArgsType, Resolver, Query, Args } from "type-graphql"
import { SortValues } from "../util/types"
import { Athlete, mapPlayerDataKeys, filterAndSortAthletes } from "./AthletesResolver"

@InputType()
class DownloadSearchParamsInput {
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
  @Field(() => DownloadSearchParamsInput, { nullable: true })
  downloadSearchParams?: DownloadSearchParamsInput | null
}

@Resolver(() => String)
export class DownloadCSVResolver {
  @Query(() => String)
  downloadCSV(@Args() { downloadSearchParams }: AthletesResolverArgs): string {
    const allAthletes: Athlete[] = mapPlayerDataKeys()
    const formattedAthletes = filterAndSortAthletes(allAthletes, downloadSearchParams)

    return JSON.stringify(formattedAthletes)
  }
}