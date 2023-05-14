import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client";

let client: ApolloClient<NormalizedCacheObject> | undefined = undefined;

const getClient = () => {
  const uri = process.env.GRAPHQL_URI || "http://localhost:8080";
  if (typeof window !== "undefined") {
    // Si window no es undefined, estamos en el lado del cliente
    if (!client) {
      // Si el cliente aún no se ha creado, crea una nueva instancia
      client = new ApolloClient({
        uri: uri,
        cache: new InMemoryCache(),
      });
    }
    return client;
  } else {
    // Si window es undefined, estamos en el lado del servidor
    return new ApolloClient({
      uri: uri,
      cache: new InMemoryCache(),
    });
  }
};

export default getClient;

// import { ApolloClient, InMemoryCache } from "@apollo/client";

// export function initializeApollo(initialState = null) {
//   const _apolloClient = new ApolloClient({
//     uri: uri, // reemplaza esto con tu endpoint de GraphQL
//     cache: new InMemoryCache().restore(initialState || {}),
//   });

//   return _apolloClient;
// }
