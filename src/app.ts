import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import productRoutes from './routes/products';
import { attachRequestId } from './middleware/validation';
import { ApiResponse } from './types';

const app: Application = express();

// Security middleware
app.use(helmet());

// Middleware
app.use(express.json());
app.use(attachRequestId);

// Health check endpoint
app.get('/health', (req: Request, res: Response): void => {
  const requestId = req.requestId;
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: 'healthy' },
    timestamp: new Date().toISOString(),
    requestId,
  };

  res.status(200).json(response);
});

// Routes
app.use('/products', productRoutes);

// 404 handler
app.use((req: Request, res: Response): void => {
  const requestId = req.requestId;
  const response: ApiResponse<null> = {
    success: false,
    error: {
      errorCode: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
    timestamp: new Date().toISOString(),
    requestId,
  };

  res.status(404).json(response);
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction): void => {
  const requestId = req.requestId;
  console.error(`[${requestId}] Unhandled error:`, err);
  
  const response: ApiResponse<null> = {
    success: false,
    error: {
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
    },
    timestamp: new Date().toISOString(),
    requestId,
  };

  res.status(500).json(response);
});

export default app;
