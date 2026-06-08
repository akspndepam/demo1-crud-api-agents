import request from 'supertest';
import app from '../src/app';
import { ProductRepository } from '../src/dal/ProductRepository';
import { describe, it, beforeEach, expect } from '@jest/globals';

describe('Product CRUD API', (): void => {
  beforeEach((): void => {
    ProductRepository.resetData();
  });

  // ============================================
  // POST /products - Create Product Tests
  // ============================================

  describe('POST /products', (): void => {
    // Positive test
    it('should create a product with valid details', async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.price).toBe(productData.price);
      expect(response.body.data.productId).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.requestId).toBeDefined();
    });

    // Negative test - missing required field
    it('should fail to create a product with missing required fields', async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        // Missing category and stockQuantity
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.errorCode).toBe('INVALID_INPUT');
    });

    // Invalid input test - invalid data types
    it('should fail with invalid input data types', async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 'invalid-price', // Should be number
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('INVALID_INPUT');
    });

    // Null input test
    it('should fail with null/undefined values', async (): Promise<void> => {
      const productData = {
        name: null,
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('INVALID_INPUT');
    });
  });

  // ============================================
  // GET /products/:id - Retrieve Product Tests
  // ============================================

  describe('GET /products/:id', (): void => {
    let productId: string;

    beforeEach(async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData);

      productId = response.body.data.productId;
    });

    // Positive test
    it('should retrieve a product by valid ID', async (): Promise<void> => {
      const response = await request(app)
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.productId).toBe(productId);
      expect(response.body.data.name).toBe('Wireless Headphones');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.requestId).toBeDefined();
    });

    // Negative test - non-existent product
    it('should return 404 for non-existent product ID', async (): Promise<void> => {
      const response = await request(app)
        .get('/products/non-existent-id-12345')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.errorCode).toBe('PRODUCT_NOT_FOUND');
      expect(response.body.error.message).toBe('Product not found');
    });

    // Invalid input test - invalid ID format (non-existent product)
    it('should fail with invalid ID format', async (): Promise<void> => {
      const response = await request(app)
        .get('/products/invalid-id-that-doesnt-exist-xyz')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('PRODUCT_NOT_FOUND');
    });

    // Null input test - accessing with just the base path
    it('should retrieve all products when accessing base path', async (): Promise<void> => {
      const response = await request(app)
        .get('/products/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // ============================================
  // GET /products - Retrieve All Products Tests
  // ============================================

  describe('GET /products', (): void => {
    // Positive test
    it('should retrieve all products', async (): Promise<void> => {
      const productData1 = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const productData2 = {
        name: 'USB-C Cable',
        description: 'High-speed USB-C cable',
        price: 9.99,
        category: 'Cables',
        stockQuantity: 500,
      };

      await request(app).post('/products').send(productData1);
      await request(app).post('/products').send(productData2);

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.requestId).toBeDefined();
    });

    // Negative test - empty collection
    it('should retrieve empty array when no products exist', async (): Promise<void> => {
      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    // Invalid input test - with query parameters (should still work)
    it('should handle GET request with query parameters gracefully', async (): Promise<void> => {
      const response = await request(app)
        .get('/products?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Null input test - checking multiple scenarios
    it('should return all products regardless of null query params', async (): Promise<void> => {
      const productData = {
        name: 'Test Product',
        description: 'Test description',
        price: 29.99,
        category: 'Test',
        stockQuantity: 100,
      };

      await request(app).post('/products').send(productData);

      const response = await request(app)
        .get('/products?filter=null')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  // ============================================
  // PUT /products/:id - Update Product Tests
  // ============================================

  describe('PUT /products/:id', (): void => {
    let productId: string;

    beforeEach(async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData);

      productId = response.body.data.productId;
    });

    // Positive test
    it('should update a product with valid details', async (): Promise<void> => {
      const updateData = {
        name: 'Updated Wireless Headphones',
        price: 89.99,
        stockQuantity: 200,
      };

      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.productId).toBe(productId);
      expect(response.body.timestamp).toBeDefined();
    });

    // Negative test - non-existent product
    it('should fail to update a non-existent product', async (): Promise<void> => {
      const updateData = {
        name: 'Updated Product',
        price: 99.99,
      };

      const response = await request(app)
        .put('/products/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('PRODUCT_NOT_FOUND');
    });

    // Invalid input test - invalid data types
    it('should fail with invalid update data types', async (): Promise<void> => {
      const updateData = {
        name: 'Updated Headphones',
        price: 'invalid-price', // Should be number
        stockQuantity: 150,
      };

      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('INVALID_INPUT');
    });

    // Null input test - update with null values
    it('should fail when update contains invalid null values', async (): Promise<void> => {
      const updateData = {
        name: null,
        price: 89.99,
      };

      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('INVALID_INPUT');
    });
  });

  // ============================================
  // DELETE /products/:id - Delete Product Tests
  // ============================================

  describe('DELETE /products/:id', (): void => {
    let productId: string;

    beforeEach(async (): Promise<void> => {
      const productData = {
        name: 'Wireless Headphones',
        description: 'High-quality noise-cancelling headphones',
        price: 79.99,
        category: 'Electronics',
        stockQuantity: 150,
      };

      const response = await request(app)
        .post('/products')
        .send(productData);

      productId = response.body.data.productId;
    });

    // Positive test
    it('should delete a product by valid ID', async (): Promise<void> => {
      const response = await request(app)
        .delete(`/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.message).toBe('Product deleted successfully');
      expect(response.body.timestamp).toBeDefined();

      // Verify product is deleted
      const getResponse = await request(app)
        .get(`/products/${productId}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    // Negative test - non-existent product
    it('should fail to delete a non-existent product', async (): Promise<void> => {
      const response = await request(app)
        .delete('/products/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('PRODUCT_NOT_FOUND');
      expect(response.body.error.message).toBe('Product not found');
    });

    // Invalid input test - invalid ID format (non-existent product)
    it('should fail with invalid ID format during deletion', async (): Promise<void> => {
      const response = await request(app)
        .delete('/products/invalid-id-that-doesnt-exist-xyz')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.errorCode).toBe('PRODUCT_NOT_FOUND');
    });

    // Null input test
    it('should fail when trying to delete with null ID', async (): Promise<void> => {
      const response = await request(app)
        .delete('/products/')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
