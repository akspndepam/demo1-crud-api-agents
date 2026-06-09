export interface User {
  userId: string;
  username: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string; // plain text, will be hashed
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
