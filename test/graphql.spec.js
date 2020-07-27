import { mockGraphQL, graphQLSchemaFromFile } from '../dist';
import { Selector, RequestMock } from 'testcafe';
import { GraphQLError } from 'graphql';

const mock = {
  Query: () => ({
    user: ({ id }) => ({
      id: 1,
      name: 'Name',
      email: 'Email',
    }),
  }),
};

const mockError = {
  Query: () => ({
    user: ({ id }) => {
      throw new GraphQLError('Name is required');
    },
  }),
};

fixture(`GraphQL Mock test`).page('http://localhost:3000/');

test('graphql mock with No delay', async (t) => {
  const requestMockNoDelay = RequestMock()
    .onRequestTo({ url: 'http://localhost:3000/graphql', method: 'POST' })
    .respond(async (req, res) => {
      await mockGraphQL(
        {
          schema: graphQLSchemaFromFile(
            `${process.cwd()}/test/test-schema.graphql`
          ),
          mock,
        },
        req,
        res
      );
    });

  await t.addRequestHooks(requestMockNoDelay);
  await t.click(Selector('#GET_USER'));
  await t.expect(Selector('#data').textContent).contains(
    JSON.stringify({
      user: { id: 1, name: 'Name', email: 'Email', __typename: 'User' },
    })
  );
});

test('graphql mock with specified delay', async (t) => {
  const requestMockDelay = RequestMock()
    .onRequestTo({ url: 'http://localhost:3000/graphql', method: 'POST' })
    .respond(async (req, res) => {
      await mockGraphQL(
        {
          schema: graphQLSchemaFromFile(
            `${process.cwd()}/test/test-schema.graphql`
          ),
          mock,
          delay: 5000,
        },
        req,
        res
      );
    });

  await t.addRequestHooks(requestMockDelay);
  await t.click(Selector('#GET_USER'));
  await t.expect(Selector('#data').textContent).contains(
    JSON.stringify({
      user: { id: 1, name: 'Name', email: 'Email', __typename: 'User' },
    })
  );
});

test('graphql mock error', async (t) => {
  const requestMockError = RequestMock()
    .onRequestTo({ url: 'http://localhost:3000/graphql', method: 'POST' })
    .respond(async (req, res) => {
      await mockGraphQL(
        {
          schema: graphQLSchemaFromFile(
            `${process.cwd()}/test/test-schema.graphql`
          ),
          mock: mockError,
        },
        req,
        res
      );
    });
  await t.addRequestHooks(requestMockError);
  await t.click(Selector('#GET_USER'));
  await t
    .expect(Selector('#error').textContent)
    .contains('GraphQL error: Name is required');
});
