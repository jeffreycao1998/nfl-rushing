import { ApolloClient, InMemoryCache } from "@apollo/client"
import { relayStylePagination } from "@apollo/client/utilities"

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          athletes: relayStylePagination(),
        }
      }
    }
  }),
})

export default client