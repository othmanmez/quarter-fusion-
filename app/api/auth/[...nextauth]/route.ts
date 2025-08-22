import { handlers } from '@/lib/auth';

// Force Node.js runtime to avoid Edge Runtime issues with bcrypt
export const runtime = 'nodejs';

export const { GET, POST } = handlers;