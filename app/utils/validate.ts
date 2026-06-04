// app/utils/validate.ts

/**
 * 判断是否为外部链接
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 校验用户名 (4到16位字母、数字、下划线)
 */
export function isValidUsername(val: string): boolean {
  return /^[a-zA-Z0-9_]{4,16}$/.test(val);
}

/**
 * 校验邮箱
 */
export function isValidEmail(val: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
}

/**
 * 校验手机号
 */
export function isValidPhone(val: string): boolean {
  return /^1[3-9]\d{9}$/.test(val);
}
