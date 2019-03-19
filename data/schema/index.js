import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./queries/";
import resolvers from "./mutations/";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
