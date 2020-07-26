const { RequestMock } = require('testcafe');
const { mockServer } = require('graphql-tools');

let server;

const handler = async (req, res) => {
  const body = JSON.parse(req.body.toString('utf8'));
  console.log(`req: ${JSON.stringify(body)}`);
  const { variables } = body;

  console.log(`variables: ${JSON.stringify(variables)}`);
  let data = null;
  data = await server.query(body.query, body.variables);
  console.log(`data: ${JSON.stringify(data)}`);

  res.setBody(JSON.stringify(data));
};

export const mockGraphQL = (schema, mock) => {
  server = mockServer(schema, mock);
};

export const mockit = RequestMock()
  .onRequestTo({ url: `http://localhost:3000/graphql`, method: 'POST' })
  .respond(async (req, res) => {
    await handler(req, res);
  });
