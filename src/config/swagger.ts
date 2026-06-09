import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product CRUD API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing products with full CRUD operations. Built with Express.js and TypeScript.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['productId', 'name', 'description', 'price', 'category', 'stockQuantity', 'createdAt', 'updatedAt'],
          properties: {
            productId: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the product (UUID v4)',
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Product name',
              example: 'Wireless Headphones',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Detailed product description',
              example: 'High-quality wireless headphones with noise cancellation',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price with up to 2 decimal places',
              example: 99.99,
            },
            category: {
              type: 'string',
              maxLength: 100,
              description: 'Product category',
              example: 'Electronics',
            },
            stockQuantity: {
              type: 'integer',
              minimum: 0,
              description: 'Number of items in stock',
              example: 150,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when product was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when product was last updated',
            },
          },
        },
        CreateProductRequest: {
          type: 'object',
          required: ['name', 'description', 'price', 'category', 'stockQuantity'],
          properties: {
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Product name',
              example: 'Wireless Headphones',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Detailed product description',
              example: 'High-quality wireless headphones with noise cancellation',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price (max 2 decimal places)',
              example: 99.99,
            },
            category: {
              type: 'string',
              maxLength: 100,
              description: 'Product category',
              example: 'Electronics',
            },
            stockQuantity: {
              type: 'integer',
              minimum: 0,
              description: 'Number of items in stock',
              example: 150,
            },
          },
        },
        UpdateProductRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Product name',
              example: 'Updated Wireless Headphones',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Detailed product description',
              example: 'Updated description with new features',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price (max 2 decimal places)',
              example: 89.99,
            },
            category: {
              type: 'string',
              maxLength: 100,
              description: 'Product category',
              example: 'Electronics',
            },
            stockQuantity: {
              type: 'integer',
              minimum: 0,
              description: 'Number of items in stock',
              example: 200,
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Product' },
                { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                { type: 'object', properties: { status: { type: 'string' } } },
              ],
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Server timestamp of response',
            },
            requestId: {
              type: 'string',
              format: 'uuid',
              description: 'Unique request identifier for tracking',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                errorCode: {
                  type: 'string',
                  description: 'Error code identifier',
                  example: 'INVALID_PARAMETER_FORMAT',
                },
                message: {
                  type: 'string',
                  description: 'Human-readable error message',
                  example: 'Invalid product ID format',
                },
                field: {
                  type: 'string',
                  description: 'Field name that caused the error (if applicable)',
                  example: 'price',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            requestId: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for API authentication. Obtain via /auth/login or /auth/register endpoints.',
        },
        requestId: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Request-ID',
          description: 'Optional request ID for tracking. Auto-generated if not provided.',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User registration and login operations',
      },
      {
        name: 'Products',
        description: 'Product management operations (requires authentication)',
      },
      {
        name: 'Health',
        description: 'Service health check (no authentication required)',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
