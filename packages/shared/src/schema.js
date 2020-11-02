import { schema as feeds } from '@graphql-stream/feeds';
import { schema as chat } from '@graphql-stream/chat';
import { mergeSchemas } from '@graphql-tools/merge';

export const schema = mergeSchemas({
    schemas: [feeds, chat],
});
