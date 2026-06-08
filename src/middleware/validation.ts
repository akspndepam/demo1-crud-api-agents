import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateRequestId = (): string => uuidv4();

export const validateProductCreation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, description, price, category, stockQuantity } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (stockQuantity === undefined || stockQuantity === null) {
    errors.push('Stock quantity is required');
  } else if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    errors.push('Stock quantity must be a non-negative integer');
  }

  if (errors.length > 0) {
    const requestId = generateRequestId();
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INVALID_INPUT',
        message: errors.join('; '),
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateProductUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, description, price, category, stockQuantity } = req.body;
  const errors: string[] = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description must be a non-empty string');
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      errors.push('Category must be a non-empty string');
    }
  }

  if (stockQuantity !== undefined) {
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      errors.push('Stock quantity must be a non-negative integer');
    }
  }

  if (errors.length > 0) {
    const requestId = generateRequestId();
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INVALID_INPUT',
        message: errors.join('; '),
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateProductId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    const requestId = generateRequestId();
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INVALID_PARAMETER_FORMAT',
        message: 'Product ID must be a valid non-empty string',
        field: 'id',
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const attachRequestId = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).requestId = generateRequestId();
  next();
};
