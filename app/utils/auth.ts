// app/utils/auth.ts

const TokenKey = 'admin-token';
const RefreshTokenKey = 'admin-refresh-token';

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TokenKey) : null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TokenKey, token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TokenKey);
  }
}

export function getRefreshToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(RefreshTokenKey) : null;
}

export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RefreshTokenKey, token);
  }
}

export function removeRefreshToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(RefreshTokenKey);
  }
}
