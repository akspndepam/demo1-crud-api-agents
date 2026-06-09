import { Product, CreateProductDTO, UpdateProductDTO } from '../types';
import { ProductModel } from '../models/Product';
import { getDatabase } from '../config/database';

export interface IProductRepository {
  create(product: CreateProductDTO): Promise<Product>;
  getById(productId: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
  update(productId: string, productData: UpdateProductDTO): Promise<Product | null>;
  delete(productId: string): Promise<boolean>;
  exists(productId: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  async create(productData: CreateProductDTO): Promise<Product> {
    try {
      const product = new ProductModel(
        productData.name,
        productData.description,
        productData.price,
        productData.category,
        productData.stockQuantity,
      );

      const db = getDatabase();
      const productJson = product.toJSON() as Product;

      const stmt = db.prepare(`
        INSERT INTO products (productId, name, description, price, category, stockQuantity, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        productJson.productId,
        productJson.name,
        productJson.description,
        productJson.price,
        productJson.category,
        productJson.stockQuantity,
        productJson.createdAt.toISOString(),
        productJson.updatedAt.toISOString(),
      );

      return productJson;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      throw new Error(`Database error during product creation: ${message}`);
    }
  }

  async getById(productId: string): Promise<Product | null> {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM products WHERE productId = ?');
      const row = stmt.get(productId) as unknown;

      if (!row) {
        return null;
      }

      return this.rowToProduct(row as Record<string, unknown>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve product';
      throw new Error(`Database error while retrieving product: ${message}`);
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM products');
      const rows = stmt.all() as unknown[];

      return rows.map((row) => this.rowToProduct(row as Record<string, unknown>));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve products';
      throw new Error(`Database error while retrieving products: ${message}`);
    }
  }

  async update(productId: string, productData: UpdateProductDTO): Promise<Product | null> {
    try {
      const existingProduct = await this.getById(productId);
      if (!existingProduct) {
        return null;
      }

      const updatedProduct: Product = {
        ...existingProduct,
        ...productData,
        productId: existingProduct.productId,
        createdAt: existingProduct.createdAt,
        updatedAt: new Date(),
      };

      const db = getDatabase();
      const stmt = db.prepare(`
        UPDATE products
        SET name = ?, description = ?, price = ?, category = ?, stockQuantity = ?, updatedAt = ?
        WHERE productId = ?
      `);

      stmt.run(
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.category,
        updatedProduct.stockQuantity,
        updatedProduct.updatedAt.toISOString(),
        productId,
      );

      return updatedProduct;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      throw new Error(`Database error during product update: ${message}`);
    }
  }

  async delete(productId: string): Promise<boolean> {
    try {
      const db = getDatabase();
      const stmt = db.prepare('DELETE FROM products WHERE productId = ?');
      const result = stmt.run(productId) as unknown;

      if (typeof result === 'object' && result !== null && 'changes' in result) {
        return (result as { changes: number }).changes > 0;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      throw new Error(`Database error during product deletion: ${message}`);
    }
  }

  async exists(productId: string): Promise<boolean> {
    try {
      const product = await this.getById(productId);
      return product !== null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check product existence';
      throw new Error(`Database error checking product existence: ${message}`);
    }
  }

  private rowToProduct(row: Record<string, unknown>): Product {
    return {
      productId: row.productId as string,
      name: row.name as string,
      description: row.description as string,
      price: row.price as number,
      category: row.category as string,
      stockQuantity: row.stockQuantity as number,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    };
  }

  static resetData(): void {
    const db = getDatabase();
    db.exec('DELETE FROM products');
  }
}
