<!-- app/components/layout/AppBreadcrumb.vue -->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 最后一级、不可点击路由或含有子节点的目录项直接显示文本 -->
        <span
          v-if="index === levelList.length - 1 || item.redirect === 'noRedirect' || (item.children && item.children.length > 0)"
          class="no-redirect"
        >
          {{ item.meta?.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationMatched } from 'vue-router';
import { useMenuStore } from '~/stores/modules/menu';

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

const levelList = ref<any[]>([]);

// 深度优先搜索，反查当前路由路径在菜单树中的父链
const findMenuPathChain = (menus: any[], targetPath: string, chain: any[] = []): boolean => {
  for (const item of menus) {
    chain.push(item);
    if (item.path === targetPath) {
      return true;
    }
    if (item.children && item.children.length > 0) {
      if (findMenuPathChain(item.children, targetPath, chain)) {
        return true;
      }
    }
    chain.pop();
  }
  return false;
};

const getBreadcrumb = () => {
  const chain: any[] = [];
  const found = findMenuPathChain(menuStore.sidebarMenus, route.path, chain);
  
  if (found) {
    // 1. 如果在菜单树中找到了匹配路径，使用该树的完整父子层级
    levelList.value = chain.filter(
      (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    );
  } else {
    // 2. 如果没找到，降级使用路由 matched 层级，并彻底移除原先强行塞入“仪表盘”前缀的逻辑
    const matched = route.matched.filter((item) => item.meta && item.meta.title);
    levelList.value = matched.filter(
      (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    );
  }
};

const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect as string);
    return;
  }
  router.push(path);
};

watch(
  () => route.path,
  () => getBreadcrumb(),
  { immediate: true }
);
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: var(--header-height);
  margin-left: 8px;

  .no-redirect {
    color: var(--text-placeholder);
    cursor: text;
  }

  a {
    font-weight: normal;
    color: var(--text-regular);
    &:hover {
      color: var(--primary-color);
    }
  }
}

// 动画
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
