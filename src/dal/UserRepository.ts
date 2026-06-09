import { getDatabase } from '../config/database';
import { User, CreateUserDTO } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export class UserRepository {
  private db = getDatabase();

  async create(userData: CreateUserDTO): Promise<User> {
    try {
      // Check if user already exists
      const existing = this.db.prepare('SELECT userId FROM users WHERE email = ? OR username = ?').get(userData.email, userData.username) as Record<string, unknown> | undefined;
      
      if (existing) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const userId = uuidv4();
      const now = new Date().toISOString();

      const stmt = this.db.prepare(`
        INSERT INTO users (userId, username, email, password, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(userId, userData.username, userData.email, hashedPassword, 'user', now, now);

      return {
        userId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(now),
        updatedAt: new Date(now),
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as Record<string, unknown> | undefined;

      if (!row) {
        return null;
      }

      return this.mapRowToUser(row);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(userId: string): Promise<User | null> {
    try {
      const row = this.db.prepare('SELECT * FROM users WHERE userId = ?').get(userId) as Record<string, unknown> | undefined;

      if (!row) {
        return null;
      }

      return this.mapRowToUser(row);
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Failed to verify password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapRowToUser(row: Record<string, unknown>): User {
    return {
      userId: row.userId as string,
      username: row.username as string,
      email: row.email as string,
      password: row.password as string,
      role: (row.role as string) === 'admin' ? 'admin' : 'user',
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    };
  }
}
