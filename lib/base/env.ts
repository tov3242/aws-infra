import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config({ path: './lib/base/.env' });

const envScheme = z.object({
    VPC_CIDR: z.string().nonempty(),
    VPC_MAX_AZS: z.coerce.number().int(),
    VPC_SUBNET_CIDR_MASK: z.coerce.number().int().max(32),
    DEFAULT_HOSTED_ZONE_NAME: z.string().nonempty()
});

const env = envScheme.parse(process.env);

export default env;
