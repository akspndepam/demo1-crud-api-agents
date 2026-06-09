import app from './app';
import { initializeDatabase, closeDatabase } from './config/database';

initializeDatabase();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/products`);
});

process.on('SIGTERM', (): void => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close((): void => {
    closeDatabase();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', (): void => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close((): void => {
    closeDatabase();
    console.log('HTTP server closed');
    process.exit(0);
  });
});
