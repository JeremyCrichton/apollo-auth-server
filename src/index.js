import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

// Implement Schema
const resolvers = {
  Query,
  Mutation
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({ ...request, prisma })
});

server.start(({ port, endpoint }) =>
  console.log(`Server started, on port ${port} for incoming requests.`)
);
