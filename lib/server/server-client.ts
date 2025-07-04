import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  HttpLink,
} from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

export const serverClient = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // replace with your graphql endpoint
    headers: {
      Authorization: `apikey ${process.env.GRAPH_TOKEN}`,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions,
});
