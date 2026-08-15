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

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    //Basic auth header , usrname and password
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      payload,
      {
        headers: {
          Authorization: `Basic ${btoa(`${payload.email}:${payload.password}`)}`,
        },
      },
    );

    // const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
