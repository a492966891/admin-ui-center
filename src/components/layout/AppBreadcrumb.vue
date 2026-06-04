<!-- app/components/layout/AppBreadcrumb.vue -->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 最后一级或者不可点击的节点直接显示文本 -->
        <span
          v-if="index === levelList.length - 1 || item.redirect === 'noRedirect'"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationMatched } from 'vue-router';

const route = useRoute();
const router = useRouter();

const levelList = ref<RouteLocationMatched[]>([]);

const getBreadcrumb = () => {
  // 只获取带有 meta.title 的 matched 路由层级
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  
  const first = matched[0];
  // 如果首位不是仪表盘，手动在前面加上仪表盘作为首个面包屑
  if (first && first.path !== '/dashboard' && first.path !== '/') {
    matched = ([
      { path: '/dashboard', meta: { title: '仪表盘' } },
    ] as any).concat(matched);
  }

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
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
