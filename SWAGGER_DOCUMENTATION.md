# Swagger API Documentation Setup

## Overview

This project now includes comprehensive **Swagger/OpenAPI 3.0** documentation for all API endpoints. The Swagger UI provides an interactive interface to explore, test, and understand the Product CRUD API.

## Access Swagger Documentation

### Development Environment
- **Swagger UI**: http://localhost:3000/api-docs
- **Swagger JSON Spec**: http://localhost:3000/api-docs/swagger.json

### Production Environment
- **Swagger UI**: https://api.example.com/api-docs
- **Swagger JSON Spec**: https://api.example.com/api-docs/swagger.json

## Available Endpoints Documentation

### Health Check
- **Path**: `GET /health`
- **Description**: Service health status endpoint for monitoring
- **Response**: `{ success: true, data: { status: "healthy" }, timestamp: "...", requestId: "..." }`

### Product Management (Products)

#### Create Product
- **Path**: `POST /products`
- **Description**: Creates a new product with auto-generated UUID and timestamps
- **Request Body**:
  ```json
  {
    "name": "string (max 255 chars)",
    "description": "string (max 1000 chars)",
    "price": "number (max 2 decimals)",
    "category": "string (max 100 chars)",
    "stockQuantity": "integer (min 0)"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "productId": "uuid",
      "name": "string",
      "description": "string",
      "price": "number",
      "category": "string",
      "stockQuantity": "integer",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    },
    "timestamp": "ISO 8601 timestamp",
    "requestId": "uuid"
  }
  ```

#### Retrieve All Products
- **Path**: `GET /products`
- **Description**: Fetches all products in the system
- **Response** (200): Array of Product objects

#### Retrieve Product by ID
- **Path**: `GET /products/{id}`
- **Description**: Fetches a single product by UUID
- **Parameters**: `id` (path, required, UUID format)
- **Success Response** (200): Single Product object
- **Error Responses**:
  - `400`: Invalid UUID format
  - `404`: Product not found

#### Update Product
- **Path**: `PUT /products/{id}`
- **Description**: Updates a product (partial or full updates supported)
- **Parameters**: `id` (path, required, UUID format)
- **Request Body** (all fields optional):
  ```json
  {
    "name": "string (max 255 chars)",
    "description": "string (max 1000 chars)",
    "price": "number (max 2 decimals)",
    "category": "string (max 100 chars)",
    "stockQuantity": "integer (min 0)"
  }
  ```
- **Success Response** (200): Updated Product object
- **Error Responses**:
  - `400`: Invalid input data or invalid UUID format
  - `404`: Product not found

#### Delete Product
- **Path**: `DELETE /products/{id}`
- **Description**: Permanently deletes a product
- **Parameters**: `id` (path, required, UUID format)
- **Success Response** (200): `{ success: true, data: { message: "Product deleted successfully" }, ... }`
- **Error Responses**:
  - `400`: Invalid UUID format
  - `404`: Product not found

## Swagger Implementation Details

### Files Added/Modified

1. **src/config/swagger.ts** (NEW)
   - Swagger/OpenAPI 3.0 specification configuration
   - Defines all schemas, endpoints, security schemes, and response examples
   - Uses JSDoc comments from route handlers for endpoint documentation

2. **src/routes/products.ts** (MODIFIED)
   - Added comprehensive `@swagger` JSDoc comments for all 5 endpoints
   - Includes request/response schemas with examples
   - Documents all error scenarios and status codes

3. **src/app.ts** (MODIFIED)
   - Integrated `swagger-ui-express` middleware
   - Mounted Swagger UI at `/api-docs` endpoint
   - Added JSON spec endpoint at `/api-docs/swagger.json`
   - Added Swagger documentation for `/health` endpoint

4. **package.json** (MODIFIED)
   - Added dependencies: `swagger-ui-express`, `swagger-jsdoc`
   - Added dev dependencies: `@types/swagger-jsdoc`, `@types/swagger-ui-express`

### Features

✅ **Interactive API Testing**: Test all endpoints directly from the Swagger UI  
✅ **Request/Response Examples**: Real-world examples for all endpoints  
✅ **Schema Validation**: Complete OpenAPI 3.0 schema definitions  
✅ **Error Documentation**: Detailed error responses with status codes  
✅ **Request Tracking**: Request ID correlation documented  
✅ **Security**: Helmet middleware security headers documented  
✅ **Type Safety**: Full TypeScript support for all schemas  

## API Response Structure

All responses follow a consistent format:

```typescript
{
  success: boolean;          // Operation success status
  data?: T;                  // Response data (if successful)
  error?: {                  // Error details (if failed)
    errorCode: string;       // Machine-readable error code
    message: string;         // Human-readable error message
    field?: string;          // Field name (for validation errors)
  };
  timestamp: string;         // ISO 8601 server timestamp
  requestId: string;         // UUID for request tracking
}
```

## Error Codes

- `INVALID_PARAMETER_FORMAT`: Invalid input format or validation failed
- `MISSING_REQUIRED_FIELD`: Required field is missing
- `PRODUCT_NOT_FOUND`: Product ID doesn't exist in database
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `NOT_FOUND`: Endpoint not found

## Testing with Swagger UI

1. Open http://localhost:3000/api-docs in your browser
2. Select an endpoint (e.g., POST /products)
3. Click "Try it out"
4. Enter request parameters/body
5. Click "Execute"
6. View the response status, headers, and body

### Example Workflow

1. **Create a Product**:
   - Click POST /products
   - Click "Try it out"
   - Enter product details in the request body
   - Click Execute
   - Note the returned `productId` and `requestId`

2. **Retrieve the Product**:
   - Click GET /products/{id}
   - Click "Try it out"
   - Enter the `productId` from step 1
   - Click Execute
   - Verify the product details match

3. **Update the Product**:
   - Click PUT /products/{id}
   - Click "Try it out"
   - Enter the `productId`
   - Update one or more fields in the request body
   - Click Execute
   - Verify the `updatedAt` timestamp changed

4. **Delete the Product**:
   - Click DELETE /products/{id}
   - Click "Try it out"
   - Enter the `productId`
   - Click Execute
   - Verify successful deletion message

## Integration with External Tools

The Swagger JSON spec can be imported into various tools:

- **Postman**: Import from URL: `http://localhost:3000/api-docs/swagger.json`
- **Insomnia**: Import OpenAPI 3.0 spec
- **VS Code REST Client**: Use the schema for request generation
- **API Clients**: Any OpenAPI 3.0 compatible client

## Customization

To customize the Swagger UI appearance, edit `src/app.ts`:

```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
    // Add custom options here
  },
  customCss: '.topbar { display: none }', // Hide top bar
}));
```

## Deployment Considerations

1. **Update Base URLs**: Modify `servers` in `src/config/swagger.ts` for production URLs
2. **Environment-specific Docs**: Create conditional swagger configurations for dev/prod
3. **API Key Documentation**: Add security schemes if authentication is added
4. **CORS**: Configure CORS headers for external API consumers
5. **Rate Limiting**: Document rate limits in the Swagger spec

## Next Steps

1. Start the development server: `npm run dev`
2. Open browser to http://localhost:3000/api-docs
3. Explore and test all endpoints
4. Export the API spec for client code generation
5. Share the Swagger URL with API consumers

---

**Version**: 1.0.0  
**OpenAPI Spec**: 3.0.0  
**Last Updated**: 2026-06-09
