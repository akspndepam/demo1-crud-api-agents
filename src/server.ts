import app from './app';
import { initializeDatabase, closeDatabase } from './config/database';

initializeDatabase();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (): void => {
  console.log(`[INFO] Server is running on port ${PORT}`);
  console.log(`[INFO] Health check: http://localhost:${PORT}/health`);
  console.log(`[INFO] API: http://localhost:${PORT}/products`);
});

process.on('SIGTERM', (): void => {
  console.log('[WARN] SIGTERM signal received: closing HTTP server');
  server.close((): void => {
    closeDatabase();
    console.log('[INFO] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', (): void => {
  console.log('[WARN] SIGINT signal received: closing HTTP server');
  server.close((): void => {
    closeDatabase();
    console.log('[INFO] HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error): void => {
  console.error('[ERROR] Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown): void => {
  console.error('[ERROR] Unhandled rejection:', reason);
  process.exit(1);
});
