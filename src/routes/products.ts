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
router.post(
  '/',
  validateProductCreation,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const product = await productRepository.create(req.body);

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(201).json(response);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(500).json(response);
    }
  },
);

/**
 * GET /products/:id
 * Retrieve a product by ID
 */
router.get(
  '/:id',
  validateProductId,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const { id } = req.params;

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
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve product',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(500).json(response);
    }
  },
);

/**
 * GET /products
 * Retrieve all products
 */
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const products = await productRepository.getAll();

      const response: ApiResponse<typeof products> = {
        success: true,
        data: products,
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(200).json(response);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve products',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(500).json(response);
    }
  },
);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const { id } = req.params;

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
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update product',
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
router.delete(
  '/:id',
  validateProductId,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const { id } = req.params;

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
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (req as any).requestId as string;
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete product',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };

      res.status(500).json(response);
    }
  },
);

export default router;
