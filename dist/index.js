"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphQLSchemaFromFile = exports.mockGraphQL = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("@graphql-tools/schema");
var graphql_1 = require("graphql");
var mock_1 = require("@graphql-tools/mock");
var fs = tslib_1.__importStar(require("fs"));
var path = tslib_1.__importStar(require("path"));
/**
 * waits for specified time
 * @param timeout
 */
var wait = function (timeout) { return function (response) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(response); }, timeout); });
}; };
/**
 * Set response to mocked graphql query
 * @param options
 * @param req
 * @param res
 */
var mockGraphQL = function (options, req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var schema, schemaWithMocks, payload, query, variables, data;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schema = (0, schema_1.makeExecutableSchema)({
                    typeDefs: schemaAsSDL(options.schema),
                });
                schemaWithMocks = (0, mock_1.addMocksToSchema)({
                    schema: schema,
                    mocks: options.mock,
                });
                payload = JSON.parse(req.body);
                query = payload.query, variables = payload.variables;
                console.log("QUERY", query);
                return [4 /*yield*/, (0, graphql_1.graphql)({
                        schema: schemaWithMocks,
                        source: query,
                        variableValues: variables,
                    })
                        .then(wait(options.delay ? options.delay : 0))
                        .then(function (data) { return data; })];
            case 1:
                data = _a.sent();
                res.setBody(JSON.stringify(data));
                return [2 /*return*/];
        }
    });
}); };
exports.mockGraphQL = mockGraphQL;
/**
 * Read graphql schema from .graphql file
 * @param filePath
 */
var graphQLSchemaFromFile = function (filePath) {
    return fs.readFileSync(path.resolve(filePath), 'utf8');
};
exports.graphQLSchemaFromFile = graphQLSchemaFromFile;
/**
 * Takes the schema either as the full .graphql file (string) or the introspection object.
 * @param schema
 */
var schemaAsSDL = function (schema) {
    if (typeof schema === 'string' || Array.isArray(schema)) {
        return schema;
    }
    return (0, graphql_1.printSchema)((0, graphql_1.buildClientSchema)(schema));
};
