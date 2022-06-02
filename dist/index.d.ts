import { IntrospectionQuery } from "graphql";
import { IMocks } from "@graphql-tools/mock";
interface MockGraphQLOptions {
    mock: IMocks;
    schema: string | string[] | IntrospectionQuery;
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
