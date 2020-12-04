import { CaptainHook } from '@captain-hook/core';

import { UserEventPlugin } from './UserEventPlugin';

const capn = new CaptainHook(process.env.AUTH_SECRET, [UserEventPlugin]);

export default capn;
