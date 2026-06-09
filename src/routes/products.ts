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
 * POST /products
 * Create a new product
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
 * GET /products/:id
 * Retrieve a product by ID
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
 * GET /products
 * Retrieve all products
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
 * PUT /products/:id
 * Update a product by ID
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
 * DELETE /products/:id
 * Delete a product by ID
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
