![GraphQL Mocker logo](./logo.png)

# testcafe-graphql-mock

[![Build Status](https://circleci.com/gh/abhinaba-ghosh/testcafe-graphql-mock.svg?style=shield&branch-=master)]
[![NPM release](https://img.shields.io/npm/v/testcafe-graphql-mock.svg 'NPM release')](https://www.npmjs.com/package/testcafe-graphql-mock)
[![npm](https://img.shields.io/npm/l/graphql-faker.svg)](https://github.com/abhinaba-ghosh/testcafe-graphql-mock/blob/master/LICENSE)

simple testcafe commands for executing a mocked GraphQL server using only the client.

## Installation

```ssh
npm i -D testcafe-graphql-mock
```

## API available

```ts
interface MockGraphQLOptions {
  schema: string | string[] | IntrospectionQuery;
  mock: IMocks;
  delay?: number;
}

mockGraphQL(options: MockGraphQLOptions, req, res);
```

## Basic Usage

```js

import { mockGraphQL } from 'testcafe-graphql-mock';

// define the schema
const schema = `
type Person {
  firstname: String!
  surname: String!
}

type Query {
  people: [Person]
}
`;

// define the mock
const mock = {
  Query: () => ({
    people: () => [
      {
        firstname: 'Lee',
        surname: 'Byron',
      },
    ],
  }),
};

// create traditional testcafe request mock
const requestMock = RequestMock()
  .onRequestTo({ url: 'http://localhost:3000/graphql', method: 'POST' })
  .respond(async (req, res) => {
    await mockGraphQL(
      {
        schema,
        mock,
      },
      req,
      res
    );
  });

// now call the testcafe request mock in fixures as request hooks
fixture(`GraphQL Mock test`)
  .page('http://localhost:3000/')
  .requestHooks(requestMock);

test('test graphql mock data', async (t) => {
  await t.click(Selector('button'));
  await expect(Selector('div')).contains('Lee Byron);
});
```

## Read schema from .graphql file

You need to use `graphQLSchemaFromFile` method from the library.

```js
import { graphQLSchemaFromFile } from 'testcafe-graphql-mock';

// use the graphql schema reader method in your request mocks
const requestMock = RequestMock()
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
```

## Delay the GraphQL mocked response

use the `delay` (in milliseconds) parameter in `mockGraphQL({})` options

```js
const requestMock = RequestMock()
  .onRequestTo({ url: 'http://localhost:3000/graphql', method: 'POST' })
  .respond(async (req, res) => {
    await mockGraphQL(
      {
        schema,
        mock,
        delay: 5000,
      },
      req,
      res
    );
  });
```

### License

MIT

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/testcafe-graphql-mock/issues)

## Contribution

Any pull request is welcome.

If this plugin helps you in your automation journey, choose to [Sponsor](https://www.patreon.com/user?u=32109749&fan_landing=true)

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/testcafe-graphql-mock)! :star:

_- Copyright &copy; 2020- [Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)_
