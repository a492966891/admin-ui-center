// app/utils/format.ts
import dayjs from 'dayjs';

/**
 * 格式化日期时间
 */
export function formatDateTime(date?: string | number | Date | dayjs.Dayjs, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * 格式化日期
 */
export function formatDate(date?: string | number | Date | dayjs.Dayjs, format = 'YYYY-MM-DD'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * 格式化货币/数字金额 (带千分位)
 */
export function formatMoney(val: number | string, precision = 2): string {
  const num = Number(val);
  if (isNaN(num)) return '0.00';
  return num.toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * 字节数格式化为人类可读大小
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
