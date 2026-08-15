import type { AuthResponse, User } from "../types";
import { apiClient } from "./client";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BackendResponse<T> {
  message: string;
  data: T;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const response = await apiClient.post<BackendResponse<User>>(
      "/auth/register",
      payload
    );
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const credentials = btoa(`${payload.email}:${payload.password}`);
    const response = await apiClient.post<BackendResponse<AuthResponse>>(
      "/auth/login",
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    return response.data.data;
  },
};

