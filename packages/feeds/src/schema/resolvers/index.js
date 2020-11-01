import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';
import { EntitySelectorResolver } from '../scalars/EntitySelector';

const resolvers = loadFilesSync(path.join(__dirname, './**/!(index)*.js'));

export default mergeResolvers([
    ...resolvers,
    {
        DateTime: DateTimeResolver,
        EntitySelector: EntitySelectorResolver,
        ID: UUIDResolver,
        JSON: JSONResolver,
        JSONObject: JSONObjectResolver,
        URL: URLResolver,
    },
]);
