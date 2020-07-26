import { mockGraphQL, mockit } from '../index';
import { buildSchema, graphqlSync, introspectionQuery } from 'graphql';
import { Selector } from 'testcafe';

const schema = `
type User {
  id: Int!
  name: String!
  email: String!
  recipes: [Recipe!]!
}

type Recipe {
  id: Int!
  title: String!
  ingredients: String!
  direction: String!
  user: User!
}

type Query {
  user(id: Int!): User
  allRecipes: [Recipe!]!
  recipe(id: Int!): Recipe
}

type Mutation {
  createUser(name: String!, email: String!, password: String!): User!
  createRecipe(
    userId: Int!
    title: String!
    ingredients: String!
    direction: String!
  ): Recipe!
}
`;

const mock = {
  Query: () => ({
    user: ({ id }) => ({
      id: 1,
      name: 'Name',
      email: 'Email',
    }),
  }),
};

fixture(`Audit Test`)
  .page('http://localhost:3000/')
  .beforeEach(() => {
    mockGraphQL(schema, mock);
  })
  .requestHooks(mockit);

test('user audits webpage with specific thresholds', async (t) => {
  await t.click(Selector('#GET_USER'));
  await t.expect(Selector('#data').textContent).contains(
    JSON.stringify({
      user: { id: 1, name: 'Name', email: 'Email', __typename: 'User' },
    })
  );
});
