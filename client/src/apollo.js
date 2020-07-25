import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

export const HASURA_GRAPHQL_ENGINE_HOSTNAME = "hasuraimagedemo.herokuapp.com";
export const HASURA_GRAPHQL_ADMIN_SECRET = "mylongsecretkey";

const scheme = (proto) => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};

const wsurl = `${scheme("ws")}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
const httpurl = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true,
    // If using any password
    // connectionParams: {
    //     headers: {
    //       "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET
    //     }
    //   }
  },
});

const httpLink = new HttpLink({
  uri: httpurl,
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const createApolloClient = () => {
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

const client = createApolloClient();

export default client;
