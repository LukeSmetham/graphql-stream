import { DateResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';

import { StreamIDResolver } from './StreamID';

export const StreamScalars = {
    Date: DateResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    StreamID: StreamIDResolver,
    URL: URLResolver,
    UUID: UUIDResolver,
};
