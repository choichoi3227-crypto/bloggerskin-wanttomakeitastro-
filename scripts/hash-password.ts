import { webcrypto } from 'node:crypto';
(globalThis as unknown as { crypto: Crypto }).crypto = webcrypto as unknown as Crypto;
const { hashPassword } = await import('../src/lib/auth.ts');
const password = process.env.ADMIN_PASSWORD;
if (!password) {
  console.error('Usage: ADMIN_PASSWORD="your-password" npm run admin:hash');
  process.exit(1);
}
console.log(await hashPassword(password));
