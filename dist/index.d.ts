import { IMocks } from 'graphql-tools';
import { IntrospectionQuery } from 'graphql';
interface MockGraphQLOptions {
    schema: string | string[] | IntrospectionQuery;
    mock: IMocks;
    delay?: number;
}
/**
 * Set response to mocked graphql query
 * @param options
 * @param req
 * @param res
 */
export declare const mockGraphQL: (options: MockGraphQLOptions, req: any, res: any) => Promise<void>;
/**
 * Read graphql schema from .graphql file
 * @param filePath
 */
export declare const graphQLSchemaFromFile: (filePath: string) => string;
export {};
//# sourceMappingURL=index.d.ts.map