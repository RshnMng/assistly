import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from "@apollo/client";

const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export const BASE_URL = "";

const httpLink = createHttpLink({
  uri: `${BASE_URL}/api/graphql`,
  headers: {
    Authorization:
      "apikey bumate::local.net+1000::ea93f403d148d87f3fcd8342c6fb6ab113b528a06b40a8af5292f80b136fccb2",
  },
});

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

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;
