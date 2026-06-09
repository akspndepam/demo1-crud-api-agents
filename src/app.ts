import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import productRoutes from './routes/products';
import { attachRequestId } from './middleware/validation';
import { ApiResponse } from './types';

const app: Application = express();

// Security middleware
app.use(helmet());

// Middleware
app.use(express.json());
app.use(attachRequestId);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
  customCss: '.topbar { display: none }',
}));

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API service. Use this endpoint for monitoring and uptime checks.
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *             example:
 *               success: true
 *               data:
 *                 status: "healthy"
 *               timestamp: "2026-06-09T10:30:00.000Z"
 *               requestId: "550e8400-e29b-41d4-a716-446655440000"
 */

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
