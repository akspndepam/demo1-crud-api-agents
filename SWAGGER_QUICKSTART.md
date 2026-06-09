# Swagger Quick Start Guide

## Installation & Setup (Already Completed ✅)

The Swagger documentation has been fully integrated into your Product CRUD API. Here's what was set up:

### Installed Packages
- `swagger-ui-express`: ^5.0.0 - Interactive API documentation UI
- `swagger-jsdoc`: ^6.2.8 - JSDoc to OpenAPI specification converter
- Type definitions for both packages

### Configuration Files Created
1. **src/config/swagger.ts**: Complete OpenAPI 3.0 specification with schemas and examples
2. **Updated src/routes/products.ts**: Added Swagger annotations to all endpoints
3. **Updated src/app.ts**: Mounted Swagger UI and JSON endpoint

## Running the Development Server

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

The server will start on **http://localhost:3000**

## Accessing Swagger Documentation

### In Your Browser
1. Open: **http://localhost:3000/api-docs**
2. You'll see the interactive Swagger UI
3. All endpoints are listed with full documentation

### API Endpoints Available

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health status |
| POST | /products | Create new product |
| GET | /products | List all products |
| GET | /products/{id} | Get product by ID |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

## Key Swagger Features

### 1. Interactive Testing
- Click "Try it out" on any endpoint
- Automatically validates request/response format
- Shows response status, headers, and body

### 2. Schema Validation
- All request/response formats are documented
- Invalid requests are caught before sending
- Examples show correct format for each endpoint

### 3. Error Documentation
- Each endpoint documents possible error responses
- Error codes explained (INVALID_PARAMETER_FORMAT, PRODUCT_NOT_FOUND, etc.)
- Status codes clearly labeled (200, 201, 400, 404, 500)

### 4. Request ID Tracking
- All responses include unique `requestId` for debugging
- Timestamp included in every response

## Testing Workflow in Swagger UI

### Create a Product
```bash
1. Click "POST /products"
2. Click "Try it out"
3. Enter request body:
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "category": "Electronics",
  "stockQuantity": 50
}
4. Click "Execute"
5. Note the returned productId (UUID)
```

### Retrieve the Product
```bash
1. Click "GET /products/{id}"
2. Click "Try it out"
3. Paste the productId in the id field
4. Click "Execute"
5. Verify the product details
```

### Update the Product
```bash
1. Click "PUT /products/{id}"
2. Click "Try it out"
3. Paste the productId
4. Update some fields in request body:
{
  "price": 1199.99,
  "stockQuantity": 45
}
5. Click "Execute"
6. Verify updatedAt timestamp changed
```

### Delete the Product
```bash
1. Click "DELETE /products/{id}"
2. Click "Try it out"
3. Paste the productId
4. Click "Execute"
5. Verify deletion message: "Product deleted successfully"
```

## Exporting/Sharing the API Specification

### Get the Raw OpenAPI Spec
```bash
curl http://localhost:3000/api-docs/swagger.json
```

### Import into Other Tools

**Postman**:
- Collection → Import → Link
- Paste: `http://localhost:3000/api-docs/swagger.json`

**Insomnia**:
- Create → Request Collection
- Import from URL → OpenAPI 3.0

**API Clients**:
Any tool supporting OpenAPI 3.0 can use: `/api-docs/swagger.json`

## Understanding Response Format

Every API response follows this structure:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "timestamp": "2026-06-09T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

For errors:
```json
{
  "success": false,
  "error": {
    "errorCode": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "field": "productId"
  },
  "timestamp": "2026-06-09T10:30:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Validation Rules

### Product Name
- Required: Yes
- Type: String
- Max Length: 255 characters

### Product Description
- Required: Yes
- Type: String
- Max Length: 1000 characters

### Product Price
- Required: Yes
- Type: Number
- Min Value: 0
- Max Decimals: 2 (e.g., 99.99)

### Product Category
- Required: Yes
- Type: String
- Max Length: 100 characters

### Product Stock Quantity
- Required: Yes
- Type: Integer
- Min Value: 0

## Troubleshooting

### Issue: Swagger UI not loading
**Solution**: 
- Verify server is running: `npm run dev`
- Check URL is http://localhost:3000/api-docs (not https)
- Clear browser cache

### Issue: "Invalid UUID format" error
**Solution**:
- Ensure you're using a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- Try creating a new product first to get a valid UUID

### Issue: "Product not found" error
**Solution**:
- Verify the productId exists by listing all products first: GET /products
- Ensure no typos in the productId

### Issue: Build errors with TypeScript
**Solution**:
```bash
npm install
npm run build
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Next Steps

1. ✅ Swagger UI is running at http://localhost:3000/api-docs
2. ✅ All 5 CRUD endpoints are documented
3. ✅ All 20 unit tests pass
4. 📋 Consider adding authentication if needed
5. 📋 Consider adding pagination for list endpoints
6. 📋 Consider adding request rate limiting

## Support

For more information:
- View complete documentation: `SWAGGER_DOCUMENTATION.md`
- Check code review findings: `IMPLEMENTATION_SUMMARY.md`
- Review test coverage: `tests/products.test.ts`

---

**Status**: ✅ Ready for use  
**Version**: 1.0.0  
**Last Updated**: 2026-06-09
