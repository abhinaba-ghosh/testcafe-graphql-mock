import {
  IMocks,
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
import {
  IntrospectionQuery,
  buildClientSchema,
  printSchema,
  graphql,
  GraphQLSchema,
} from 'graphql';

import * as fs from 'fs';
import * as path from 'path';

interface MockGraphQLOptions {
  schema: string | string[] | IntrospectionQuery;
  mock: IMocks;
  delay?: number;
}

interface GQLRequestPayload {
  query: string;
  variables: any;
}

/**
 * waits for specified time
 * @param timeout
 */
const wait = (timeout: number) => <T>(response?: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(response), timeout));

/**
 * Set response to mocked graphql query
 * @param options
 * @param req
 * @param res
 */
export const mockGraphQL = async (
  options: MockGraphQLOptions,
  req: any,
  res: any
) => {
  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: schemaAsSDL(options.schema),
  });

  addMockFunctionsToSchema({
    schema,
    mocks: options.mock,
  });

  const payload: GQLRequestPayload = JSON.parse(req.body as string);
  const { query, variables } = payload;

  const data = await graphql({
    schema,
    source: query,
    variableValues: variables,
  })
    .then(wait(options.delay ? options.delay : 0))
    .then((data: any) => data);

  res.setBody(JSON.stringify(data));
};

/**
 * Read graphql schema from .graphql file
 * @param filePath
 */
export const graphQLSchemaFromFile = (filePath: string) =>
  fs.readFileSync(path.resolve(filePath), 'utf8');

/**
 * Takes the schema either as the full .graphql file (string) or the introspection object.
 * @param schema
 */
const schemaAsSDL = (schema: string | string[] | IntrospectionQuery) => {
  if (typeof schema === 'string' || Array.isArray(schema)) {
    return schema;
  }
  return printSchema(buildClientSchema(schema));
};
