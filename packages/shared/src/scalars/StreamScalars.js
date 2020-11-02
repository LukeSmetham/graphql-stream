import { DateResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';

import { EntitySelectorResolver } from './EntitySelector';

export const StreamScalars = {
    Date: DateResolver,
    EntitySelector: EntitySelectorResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    URL: URLResolver,
    UUID: UUIDResolver,
};