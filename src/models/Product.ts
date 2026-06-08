import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';

export class ProductModel implements Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    description: string,
    price: number,
    category: string,
    stockQuantity: number,
  ) {
    this.productId = uuidv4();
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stockQuantity = stockQuantity;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static fromJSON(data: unknown): ProductModel | null {
    if (
      typeof data === 'object' &&
      data !== null &&
      'productId' in data &&
      'name' in data &&
      'description' in data &&
      'price' in data &&
      'category' in data &&
      'stockQuantity' in data
    ) {
      const typedData = data as Record<string, unknown>;
      const product = new ProductModel(
        String(typedData.name),
        String(typedData.description),
        Number(typedData.price),
        String(typedData.category),
        Number(typedData.stockQuantity),
      );
      product.productId = String(typedData.productId);
      product.createdAt = new Date(String(typedData.createdAt));
      product.updatedAt = new Date(String(typedData.updatedAt));
      return product;
    }
    return null;
  }

  toJSON(): Omit<ProductModel, 'toJSON' | 'fromJSON'> {
    return {
      productId: this.productId,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      stockQuantity: this.stockQuantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
