// app/types/menu.d.ts

export interface MenuMeta {
  title: string;
  icon: string;
  keepAlive: boolean;
  hidden: boolean;
  permissions: string[];
  isExternal: boolean;
  isIframe: boolean;
  iframeUrl?: string;
  sort: number;
}

export interface MenuItem {
  id: number;
  parentId: number | null;
  name: string;
  path: string;
  component: string;
  redirect?: string;
  meta: MenuMeta;
  children?: MenuItem[];
}
