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
  }

  async getById(productId: string): Promise<Product | null> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM products WHERE productId = ?');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = stmt.get(productId) as any;

    if (!row) {
      return null;
    }

    return this.rowToProduct(row);
  }

  async getAll(): Promise<Product[]> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM products');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = stmt.all() as any[];

    return rows.map((row) => this.rowToProduct(row));
  }

  async update(productId: string, productData: UpdateProductDTO): Promise<Product | null> {
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
  }

  async delete(productId: string): Promise<boolean> {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM products WHERE productId = ?');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = stmt.run(productId) as any;

    return result.changes > 0;
  }

  async exists(productId: string): Promise<boolean> {
    const product = await this.getById(productId);
    return product !== null;
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
