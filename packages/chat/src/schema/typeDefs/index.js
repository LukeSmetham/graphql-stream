import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const types = loadFilesSync(path.join(__dirname, './**/*.graphql'));

export default mergeTypeDefs(types);
