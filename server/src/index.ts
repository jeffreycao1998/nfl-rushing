import "reflect-metadata"
import { ApolloServer } from "apollo-server"
import { buildSchema } from "type-graphql"
import { AthleteResolver } from "./resolvers/AthletesResolver"
import { DownloadCSVResolver } from "./resolvers/DownloadCSVResolver"

async function startServer() {
  const schema = await buildSchema({
    resolvers: [
      AthleteResolver, DownloadCSVResolver
    ],
  })
  const server = new ApolloServer({ schema })

  const { url } = await server.listen(process.env.PORT || 4000)
  console.log(`🚀  Server ready at ${url}`)
}
startServer()