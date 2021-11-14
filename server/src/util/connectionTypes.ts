import { ObjectType, Field } from "type-graphql"
import { Athlete } from "../resolvers/AthletesResolver"

@ObjectType()
export class Edge {
  @Field()
  cursor: string
  @Field(() => Athlete)
  node: Athlete
}

@ObjectType()
export class PageInfo {
  @Field()
  endCursor: string
  @Field()
  hasNextPage: boolean
}