// app/types/global.d.ts
import 'vue-router';
import { MenuMeta } from './menu';

declare module 'vue-router' {
  interface RouteMeta extends Partial<MenuMeta> {
    layout?: string;
  }
}

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}
