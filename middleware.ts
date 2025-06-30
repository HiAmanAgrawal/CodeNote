// Edge middleware cannot use Node.js modules like ioredis or rate-limiter-flexible.
// If you need to keep any Edge-compatible logic, put it here. Otherwise, this can be a no-op.

export function middleware() {
  // No-op for now
  return;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 