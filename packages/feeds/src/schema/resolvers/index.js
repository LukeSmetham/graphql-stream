import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver } from 'graphql-scalars';

const resolvers = loadFilesSync(path.join(__dirname, './**/!(index)*.js'));

export default mergeResolvers([
    ...resolvers,
    {
        DateTime: DateTimeResolver,
        JSON: JSONResolver,
        JSONObject: JSONObjectResolver,
        URL: URLResolver,
    },
]);
