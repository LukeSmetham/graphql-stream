import { SchemaComposer } from 'graphql-compose';
import { createActivityFeed } from './types/Feed';

export const createActivityFeedsSchema = composer => {
    const schemaComposer = composer || new SchemaComposer();

    schemaComposer.Query.addFields({
        feed: createActivityFeed({
            schemaComposer,
        }),
    });

    const schema = schemaComposer.buildSchema();

    return schema;
};

export * from './types';
