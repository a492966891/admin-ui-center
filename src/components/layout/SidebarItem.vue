<!-- app/components/layout/SidebarItem.vue -->
<template>
  <div v-if="!item.meta?.hidden">
    <!-- 叶子菜单节点 (无子菜单，或子菜单全部隐藏) -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        @click="handleMenuClick(onlyOneChild)"
      >
        <el-icon v-if="onlyOneChild.meta?.icon">
          <component :is="onlyOneChild.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ onlyOneChild.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 具有子菜单的目录节点 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 递归自身组件 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { MenuItem } from '~/types/menu';

const props = defineProps({
  item: {
    type: Object as () => MenuItem,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
});

const router = useRouter();
const onlyOneChild = ref<any>(null);

// 解析并拼接完整的路径
const resolvePath = (routePath: string) => {
  if (!routePath) {
    return props.basePath;
  }
  if (/^(https?:|mailto:|tel:)/.test(routePath)) {
    return routePath;
  }
  if (routePath.startsWith('/')) {
    return routePath;
  }
  // 简单拼接
  const base = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/';
  return base + routePath;
};

// 检查是否仅有一个需要显示的子菜单
const hasOneShowingChild = (children: MenuItem[] = [], parent: MenuItem) => {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false;
    } else {
      // 临时变量，后面会用到
      onlyOneChild.value = item;
      return true;
    }
  });

  // 如果没有需要显示的子菜单，展示父级菜单自身
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  // 如果只有一个子菜单，展示那个子菜单
  if (showingChildren.length === 1) {
    return true;
  }

  return false;
};

// 菜单点击回调
const handleMenuClick = (menuItem: MenuItem) => {
  const path = resolvePath(menuItem.path);
  if (menuItem.meta?.isExternal) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};
</script>
