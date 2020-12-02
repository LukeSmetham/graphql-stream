import { mergeSchemas } from '@graphql-tools/merge';
import { schema } from '@graphql-stream/chat';

export default mergeSchemas({
    schemas: [schema],
});
