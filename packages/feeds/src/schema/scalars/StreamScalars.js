import { DateResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';

import { StreamIDResolver } from './StreamID';

export const StreamScalars = {
    Date: DateResolver,
    StreamID: StreamIDResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    URL: URLResolver,
    UUID: UUIDResolver,
};
