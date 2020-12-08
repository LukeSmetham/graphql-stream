import path from 'path';
import { StreamScalars } from '../scalars';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const resolvers = loadFilesSync(path.join(__dirname, './**/!(index)*.js'));

export default mergeResolvers([...resolvers, StreamScalars]);
