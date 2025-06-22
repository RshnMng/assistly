import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from "@apollo/client";

export const BASE_URL =
  "https://bumate.us-east-a.ibm.stepzen.net/api/modest-crocodile";
// process.env.NODE_ENV !== "development"
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : "http://localhost:3000";

const httpLink = createHttpLink({
  uri: `${BASE_URL}/graphql`, // point to the new api route
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
