import { Router, Request, Response } from 'express';
import { UserRepository } from '../dal/UserRepository';
import { generateToken, JwtPayload } from '../middleware/auth';
import { ApiResponse } from '../types';

const router = Router();
const userRepository = new UserRepository();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email and password. Returns a JWT token for immediate access.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the account
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Valid email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password (minimum 6 characters recommended)
 *                 example: "securePassword123"
 *     responses:
 *       '201':
 *         description: User successfully registered
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
 *                         token:
 *                           type: string
 *                           description: JWT bearer token
 *                         user:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                               format: uuid
 *                             username:
 *                               type: string
 *                             email:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum: [user, admin]
 *             example:
 *               success: true
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   userId: "550e8400-e29b-41d4-a716-446655440000"
 *                   username: "john_doe"
 *                   email: "john@example.com"
 *                   role: "user"
 *               timestamp: "2026-06-09T10:30:00.000Z"
 *               requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '400':
 *         description: Validation error or user already exists
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
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'MISSING_REQUIRED_FIELD',
          message: 'Username, email, and password are required',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(400).json(response);
      return;
    }

    if (typeof username !== 'string' || username.trim().length < 3) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INVALID_PARAMETER_FORMAT',
          message: 'Username must be at least 3 characters',
          field: 'username',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(400).json(response);
      return;
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INVALID_PARAMETER_FORMAT',
          message: 'Invalid email format',
          field: 'email',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(400).json(response);
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INVALID_PARAMETER_FORMAT',
          message: 'Password must be at least 6 characters',
          field: 'password',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(400).json(response);
      return;
    }

    // Create user
    const user = await userRepository.create({ username, email, password });

    // Generate token
    const payload: JwtPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);

    const response: ApiResponse<{ token: string; user: Omit<typeof user, 'password'> }> = {
      success: true,
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(201).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Registration error:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
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
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates a user with email and password. Returns a JWT token for accessing protected endpoints.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: "securePassword123"
 *     responses:
 *       '200':
 *         description: Successfully logged in
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
 *                         token:
 *                           type: string
 *                           description: JWT bearer token for protected endpoints
 *                         user:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                               format: uuid
 *                             username:
 *                               type: string
 *                             email:
 *                               type: string
 *                             role:
 *                               type: string
 *                               enum: [user, admin]
 *             example:
 *               success: true
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   userId: "550e8400-e29b-41d4-a716-446655440000"
 *                   username: "john_doe"
 *                   email: "john@example.com"
 *                   role: "user"
 *               timestamp: "2026-06-09T10:30:00.000Z"
 *               requestId: "550e8400-e29b-41d4-a716-446655440001"
 *       '400':
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Invalid credentials
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
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.requestId;
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'MISSING_REQUIRED_FIELD',
          message: 'Email and password are required',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(400).json(response);
      return;
    }

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(401).json(response);
      return;
    }

    // Verify password
    const isPasswordValid = await userRepository.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(401).json(response);
      return;
    }

    // Generate token
    const payload: JwtPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);

    const response: ApiResponse<{ token: string; user: Omit<typeof user, 'password'> }> = {
      success: true,
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(200).json(response);
  } catch (error) {
    const requestId = req.requestId;
    console.error(`[${requestId}] Login error:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
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
