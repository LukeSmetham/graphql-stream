import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';

import { StreamIDResolver } from './StreamID';

export const StreamScalars = {
    Date: DateTimeResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    StreamID: StreamIDResolver,
    URL: URLResolver,
    UUID: UUIDResolver,
};
