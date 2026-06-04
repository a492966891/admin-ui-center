// app/types/user.d.ts

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email?: string;
  phone?: string;
  status: number;
  roles: string[];
  permissions: string[];
  createTime: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
}
