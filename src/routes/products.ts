import { Router, Request, Response } from 'express';
import { ProductRepository } from '../dal/ProductRepository';
import {
  validateProductCreation,
  validateProductUpdate,
  validateProductId,
} from '../middleware/validation';
import { ApiResponse } from '../types';

const router = Router();
const productRepository = new ProductRepository();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the provided details. Returns the created product with auto-generated productId and timestamps.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           examples:
 *             example1:
 *               summary: Create wireless headphones
 *               value:
 *                 name: "Wireless Headphones"
 *                 description: "High-quality wireless headphones with noise cancellation"
 *                 price: 99.99
 *                 category: "Electronics"
 *                 stockQuantity: 150
 *     responses:
 *       '201':
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     productId: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "Wireless Headphones"
 *                     description: "High-quality wireless headphones with noise cancellation"
 *                     price: 99.99
 *                     category: "Electronics"
 *                     stockQuantity: 150
 *                     createdAt: "2026-06-09T10:30:00.000Z"
 *                     updatedAt: "2026-06-09T10:30:00.000Z"
 *                   timestamp: "2026-06-09T10:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '400':
 *         description: Validation error - invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingField:
 *                 value:
 *                   success: false
 *                   error:
 *                     errorCode: "MISSING_REQUIRED_FIELD"
 *                     message: "name is required"
 *                     field: "name"
 *                   timestamp: "2026-06-09T10:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440001"
 *               invalidPrice:
 *                 value:
 *                   success: false
 *                   error:
 *                     errorCode: "INVALID_PARAMETER_FORMAT"
 *                     message: "price must have a maximum of 2 decimal places"
 *                     field: "price"
 *                   timestamp: "2026-06-09T10:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateProductCreation, async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const product = await productRepository.create(req.body);

    const response: ApiResponse<typeof product> = {
      success: true,
      data: product,
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(201).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Error creating product:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(500).json(response);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     description: Fetches a single product by its unique UUID identifier.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID identifier
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       '200':
 *         description: Product successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     productId: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "Wireless Headphones"
 *                     description: "High-quality wireless headphones with noise cancellation"
 *                     price: 99.99
 *                     category: "Electronics"
 *                     stockQuantity: 150
 *                     createdAt: "2026-06-09T10:30:00.000Z"
 *                     updatedAt: "2026-06-09T10:30:00.000Z"
 *                   timestamp: "2026-06-09T10:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '400':
 *         description: Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 errorCode: "INVALID_PARAMETER_FORMAT"
 *                 message: "Invalid product ID format"
 *               timestamp: "2026-06-09T10:30:00.000Z"
 *               requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 errorCode: "PRODUCT_NOT_FOUND"
 *                 message: "Product not found"
 *               timestamp: "2026-06-09T10:30:00.000Z"
 *               requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', validateProductId, async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const { id } = req.params as { id: string };

    const product = await productRepository.getById(id);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof product> = {
      success: true,
      data: product,
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(200).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Error retrieving product:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve product';
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(500).json(response);
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetches a list of all products in the system.
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: Products successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - productId: "550e8400-e29b-41d4-a716-446655440000"
 *                       name: "Wireless Headphones"
 *                       description: "High-quality wireless headphones with noise cancellation"
 *                       price: 99.99
 *                       category: "Electronics"
 *                       stockQuantity: 150
 *                       createdAt: "2026-06-09T10:30:00.000Z"
 *                       updatedAt: "2026-06-09T10:30:00.000Z"
 *                     - productId: "550e8400-e29b-41d4-a716-446655440001"
 *                       name: "USB-C Cable"
 *                       description: "High-speed USB-C charging and data cable"
 *                       price: 19.99
 *                       category: "Accessories"
 *                       stockQuantity: 500
 *                       createdAt: "2026-06-09T11:00:00.000Z"
 *                       updatedAt: "2026-06-09T11:00:00.000Z"
 *                   timestamp: "2026-06-09T11:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440002"
 *               empty:
 *                 value:
 *                   success: true
 *                   data: []
 *                   timestamp: "2026-06-09T11:30:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440002"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const products = await productRepository.getAll();

    const response: ApiResponse<typeof products> = {
      success: true,
      data: products,
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(200).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Error retrieving products:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve products';
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(500).json(response);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Updates an existing product with partial or full data. All fields are optional for partial updates.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID identifier
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *           examples:
 *             fullUpdate:
 *               summary: Update all fields
 *               value:
 *                 name: "Premium Wireless Headphones"
 *                 description: "Updated description with enhanced features"
 *                 price: 129.99
 *                 category: "Premium Electronics"
 *                 stockQuantity: 200
 *             partialUpdate:
 *               summary: Update only price and stock
 *               value:
 *                 price: 89.99
 *                 stockQuantity: 175
 *     responses:
 *       '200':
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     productId: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "Premium Wireless Headphones"
 *                     description: "Updated description with enhanced features"
 *                     price: 129.99
 *                     category: "Premium Electronics"
 *                     stockQuantity: 200
 *                     createdAt: "2026-06-09T10:30:00.000Z"
 *                     updatedAt: "2026-06-09T12:00:00.000Z"
 *                   timestamp: "2026-06-09T12:00:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440003"
 *       '400':
 *         description: Validation error - invalid input data or invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  validateProductId,
  validateProductUpdate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = req.requestId;
      const { id } = req.params as { id: string };

      const product = await productRepository.update(id, req.body);

      if (!product) {
        const response: ApiResponse<null> = {
          success: false,
          error: {
            errorCode: 'PRODUCT_NOT_FOUND',
            message: 'Product not found',
          },
          timestamp: new Date().toISOString(),
          requestId,
        };

        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      const requestId = req.requestId;
      console.error(`[${requestId}] Error updating product:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(500).json(response);
    }
  },
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Permanently deletes a product from the system by its UUID identifier.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID identifier
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       '200':
 *         description: Product successfully deleted
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
 *                         message:
 *                           type: string
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     message: "Product deleted successfully"
 *                   timestamp: "2026-06-09T12:15:00.000Z"
 *                   requestId: "550e8400-e29b-41d4-a716-446655440004"
 *       '400':
 *         description: Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', validateProductId, async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const { id } = req.params as { id: string };

    const exists = await productRepository.exists(id);

    if (!exists) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(404).json(response);
      return;
    }

    await productRepository.delete(id);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Product deleted successfully' },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(200).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Error deleting product:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(500).json(response);
  }
});

export default router;
