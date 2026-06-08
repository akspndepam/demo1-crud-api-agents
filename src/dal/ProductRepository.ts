import { Product, CreateProductDTO, UpdateProductDTO } from '../types';
import { ProductModel } from '../models/Product';

export interface IProductRepository {
  create(product: CreateProductDTO): Promise<Product>;
  getById(productId: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
  update(productId: string, productData: UpdateProductDTO): Promise<Product | null>;
  delete(productId: string): Promise<boolean>;
  exists(productId: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  private static products: Map<string, Product> = new Map();

  async create(productData: CreateProductDTO): Promise<Product> {
    const product = new ProductModel(
      productData.name,
      productData.description,
      productData.price,
      productData.category,
      productData.stockQuantity,
    );

    ProductRepository.products.set(product.productId, product.toJSON() as Product);
    return product.toJSON() as Product;
  }

  async getById(productId: string): Promise<Product | null> {
    const product = ProductRepository.products.get(productId);
    return product || null;
  }

  async getAll(): Promise<Product[]> {
    return Array.from(ProductRepository.products.values());
  }

  async update(
    productId: string,
    productData: UpdateProductDTO,
  ): Promise<Product | null> {
    const existingProduct = ProductRepository.products.get(productId);
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

    ProductRepository.products.set(productId, updatedProduct);
    return updatedProduct;
  }

  async delete(productId: string): Promise<boolean> {
    return ProductRepository.products.delete(productId);
  }

  async exists(productId: string): Promise<boolean> {
    return ProductRepository.products.has(productId);
  }

  static resetData(): void {
    ProductRepository.products.clear();
  }
}
