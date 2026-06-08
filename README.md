# Product CRUD API

A comprehensive RESTful API for managing product catalogs built with Express.js and TypeScript. This project implements full CRUD operations with a Data Access Layer (DAL), comprehensive validation, and extensive unit tests.

## Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete products
- ✅ **Data Access Layer**: Repository pattern for database abstraction
- ✅ **Input Validation**: Comprehensive validation for all inputs
- ✅ **Error Handling**: Structured error responses with error codes
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Unit Tests**: 20+ comprehensive tests covering all scenarios
- ✅ **ESLint Configuration**: Code quality and consistency rules
- ✅ **Prettier Formatting**: Automatic code formatting
- ✅ **Request Tracing**: Unique request IDs for tracking

## Tech Stack

- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **Jest** for unit testing
- **ESLint** for code linting
- **Prettier** for code formatting

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts             # Server entry point
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── models/
│   └── Product.ts        # Product model class
├── dal/
│   └── ProductRepository.ts  # Data Access Layer
├── middleware/
│   └── validation.ts     # Input validation middleware
└── routes/
    └── products.ts       # Product endpoints

tests/
└── products.test.ts      # Comprehensive unit tests

Configuration files:
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── jest.config.json      # Jest configuration
├── .eslintrc.json        # ESLint configuration
└── .prettierrc.json      # Prettier configuration
```

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   cd demo1-crud-api-agents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Product Endpoints

#### Create Product
- **POST** `/products`
- **Request Body:**
  ```json
  {
    "name": "Wireless Headphones",
    "description": "High-quality noise-cancelling headphones",
    "price": 79.99,
    "category": "Electronics",
    "stockQuantity": 150
  }
  ```
- **Response:** 201 Created

#### Get Product by ID
- **GET** `/products/:id`
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "data": {
      "productId": "uuid",
      "name": "Wireless Headphones",
      "description": "High-quality noise-cancelling headphones",
      "price": 79.99,
      "category": "Electronics",
      "stockQuantity": 150,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "uuid"
  }
  ```

#### Get All Products
- **GET** `/products`
- **Response:** 200 OK (array of products)

#### Update Product
- **PUT** `/products/:id`
- **Request Body:** (partial update)
  ```json
  {
    "price": 89.99,
    "stockQuantity": 200
  }
  ```
- **Response:** 200 OK

#### Delete Product
- **DELETE** `/products/:id`
- **Response:** 200 OK

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "errorCode": "ERROR_CODE",
    "message": "Error description",
    "field": "field_name (optional)"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "uuid"
}
```

### Common Error Codes

- `INVALID_INPUT` - Request validation failed
- `INVALID_PARAMETER_FORMAT` - Invalid parameter format
- `PRODUCT_NOT_FOUND` - Product not found (404)
- `INTERNAL_SERVER_ERROR` - Server error (500)
- `NOT_FOUND` - Endpoint not found (404)

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
Tests cover all CRUD operations with 4 scenarios per endpoint:
1. **Positive test** - Happy path / Success case
2. **Negative test** - Error/Failure case
3. **Invalid input test** - Invalid data types
4. **Null input test** - Null/undefined values

**Total: 20+ tests**

## Code Quality

### Linting

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix linting errors
```

### Code Formatting

```bash
npm run format      # Format code with Prettier
```

## Data Model

### Product Schema

```typescript
interface Product {
  productId: string;           // UUID
  name: string;                // Product name
  description: string;         // Product description
  price: number;               // Product price (≥ 0)
  category: string;            // Product category
  stockQuantity: number;       // Stock quantity (≥ 0, integer)
  createdAt: Date;            // Creation timestamp
  updatedAt: Date;            // Last update timestamp
}
```

## Validation Rules

### Create/Update Validation

- **name**: Required, non-empty string
- **description**: Required, non-empty string
- **price**: Required, non-negative number
- **category**: Required, non-empty string
- **stockQuantity**: Required, non-negative integer

### ID Parameter Validation

- **id**: Required, non-empty string

## API Response Structure

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;                    // Response data (if success)
  error?: ApiError;           // Error details (if failure)
  timestamp: string;          // ISO 8601 timestamp
  requestId: string;          // Unique request identifier
}
```

## Middleware

### Request ID Attachment
- Every request gets a unique UUID for tracing
- Included in all responses

### Validation Middleware
- `validateProductCreation` - Validates product creation data
- `validateProductUpdate` - Validates product update data
- `validateProductId` - Validates product ID parameter

## File Size Reference

- **Small files** (< 1KB): Type definitions, simple configs
- **Medium files** (1-5KB): Models, repositories, middleware
- **Large files** (5-10KB): Routes, tests
- **Config files** (~1KB each): TypeScript, ESLint, Prettier

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Start production server |
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript to JavaScript |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove build artifacts |

## Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Run linter** to check code quality
   ```bash
   npm run lint
   ```
3. **Format code** automatically
   ```bash
   npm run format
   ```
4. **Run tests** to verify functionality
   ```bash
   npm test
   ```
5. **Build** for production
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
```

## Version Compatibility

- **Node.js**: 16.x - 20.x
- **npm**: 8.x - 9.x
- **TypeScript**: 5.1.3
- **Express**: 4.18.2

## Performance Considerations

- Response time target: < 200ms (p95)
- Supports 1000+ concurrent requests
- Optimized query performance with repository pattern
- In-memory storage for demonstration

## Security Considerations

- Input validation on all endpoints
- Error messages don't expose sensitive information
- Request ID tracking for audit trails
- CORS disabled by default (configure as needed)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication & Authorization
- Rate limiting
- Pagination for product listings
- Caching strategies
- API versioning
- Swagger/OpenAPI documentation
- Docker containerization

## Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Test Failures
```bash
# Clear Jest cache
npx jest --clearCache
npm test
```

## Contributing

1. Follow ESLint rules
2. Format code with Prettier
3. Write tests for new features
4. Ensure all tests pass

## License

ISC

## Support

For issues or questions, please refer to the user stories documentation in `user_stories.md.txt`.
