import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { StreamScalars } from '@graphql-stream/shared';

const resolvers = loadFilesSync(path.join(__dirname, './**/!(index)*.js'));

export default mergeResolvers([...resolvers, StreamScalars]);
