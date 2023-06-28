import { User, UserResponse } from "..";


export const mockUser = {
  _id: "123456789",
  email: "you@gmail.com",
  username: "Lilith the Siren",
  createdAt: "2021-01-01T00:00:00.000Z",
} as User

export const mockRefreshAuthResponse = {
  access: "123456789",
  refresh: "",
}

export const mockUserResponse = {
  ...mockRefreshAuthResponse,
  user: mockUser
} as UserResponse