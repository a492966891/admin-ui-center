<!-- app/pages/login.vue -->
<template>
  <div class="login-container flex-center">
    <!-- 动态渐变波纹背景 (CSS实现) -->
    <div class="gradient-bg">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
    </div>

    <!-- 登录主卡片 -->
    <div class="login-card flex-center">
      <!-- 左侧：系统特色介绍 -->
      <div class="card-left hidden-sm-and-down flex-center">
        <div class="brand-info">
          <h2>Admin Center</h2>
          <p>模块化 · 响应式 · 极致动效的企业级管理后台</p>
          <div class="feature-tags">
            <span class="tag flex-center"><el-icon><Check /></el-icon> Nuxt 4 & TypeScript</span>
            <span class="tag flex-center"><el-icon><Check /></el-icon> Element Plus & SCSS</span>
            <span class="tag flex-center"><el-icon><Check /></el-icon> ECharts 5 炫酷大屏</span>
          </div>
        </div>
      </div>

      <!-- 右侧：登录表单 -->
      <div class="card-right flex-center">
        <div class="form-wrapper">
          <h3 class="form-title">欢迎登录</h3>
          <p class="form-subtitle">请输入您的管理凭证以进入系统</p>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0px"
            size="large"
            @keyup.enter="handleLogin"
          >
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名 (admin / test)"
                :prefix-icon="User"
              />
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码 (123456)"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <!-- 验证码 -->
            <el-form-item prop="captcha" class="captcha-form-item">
              <div class="captcha-wrapper flex-between w-full">
                <el-input
                  v-model="loginForm.captcha"
                  placeholder="验证码"
                  :prefix-icon="Key"
                  class="captcha-input"
                />
                <div class="captcha-img flex-center" @click="refreshCaptcha" title="点击刷新">
                  {{ captchaText }}
                </div>
              </div>
            </el-form-item>

            <!-- 记住密码与辅助链接 -->
            <div class="helper-bar flex-between w-full">
              <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>

            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                class="submit-btn w-full"
                :loading="loading"
                @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/stores/modules/user';
import { User, Lock, Key, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

// 声明布局为 auth.vue
definePageMeta({
  layout: 'auth',
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const rememberMe = ref(false);
const captchaText = ref('');

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
});

// 表单校验规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// 简单的前端生成验证码
const refreshCaptcha = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  captchaText.value = code;
};

// 登录提交
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await userStore.login({
          username: loginForm.username,
          password: loginForm.password,
        });
        
        ElMessage.success('登录成功，正在加载后台数据...');
        
        // 重定向逻辑
        const redirect = route.query.redirect as string;
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error(err);
        refreshCaptcha();
        loginForm.captcha = '';
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  refreshCaptcha();
});
</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #13151a 0%, #0d0f12 100%);
}

// 酷炫大渐变背景动画 (CSS实现，高质感流动)
.gradient-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #0b0f19, #05070a);
  top: 0;
  left: 0;
  z-index: 1;

  div {
    position: absolute;
    background: radial-gradient(circle at center, rgba(88, 86, 214, 0.15) 0, rgba(88, 86, 214, 0) 50%) no-repeat;
    mix-blend-mode: screen;
    border-radius: 50%;
    transform-origin: center center;
  }

  .g1 { width: 600px; height: 600px; top: -10%; left: -10%; animation: move 20s infinite; }
  .g2 { width: 500px; height: 500px; bottom: -10%; right: -10%; animation: move 25s infinite reverse; }
  .g3 { width: 400px; height: 400px; top: 40%; left: 30%; animation: move 30s infinite; }
  .g4 { width: 700px; height: 700px; bottom: 20%; left: -10%; animation: move 18s infinite reverse; }
  .g5 { width: 450px; height: 450px; top: 10%; right: 20%; animation: move 22s infinite; }
}

@keyframes move {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(100px, 80px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

// 毛玻璃卡片
.login-card {
  width: 1000px;
  height: 600px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);

  .card-left {
    flex: 1.2;
    height: 100%;
    background: linear-gradient(135deg, rgba(88, 86, 214, 0.2) 0%, rgba(88, 86, 214, 0.02) 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    padding: 60px;
    align-items: flex-start;

    .brand-info {
      h2 {
        font-size: 32px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 16px 0;
        letter-spacing: 1px;
      }
      p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0 0 40px 0;
        line-height: 1.6;
      }
      .feature-tags {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .tag {
          justify-content: flex-start;
          gap: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          .el-icon {
            background: rgba(52, 199, 89, 0.2);
            color: #34c759;
            padding: 4px;
            border-radius: 50%;
            font-size: 10px;
          }
        }
      }
    }
  }

  .card-right {
    flex: 1;
    height: 100%;
    padding: 50px;
    background: rgba(20, 20, 25, 0.5);

    .form-wrapper {
      width: 100%;
      max-width: 320px;

      .form-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 8px 0;
      }

      .form-subtitle {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
        margin: 0 0 32px 0;
      }
    }
  }
}

.captcha-wrapper {
  gap: 12px;
  
  .captcha-input {
    flex: 1;
  }
  
  .captcha-img {
    width: 100px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary-color-hover);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 4px;
    border-radius: var(--border-radius-small);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    user-select: none;
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
}

.helper-bar {
  margin: 8px 0 24px 0;
  
  :deep(.el-checkbox) {
    color: rgba(255, 255, 255, 0.5);
    .el-checkbox__label {
      font-size: 13px;
    }
  }
  
  .el-link {
    font-size: 13px;
  }
}

.submit-btn {
  height: 44px;
  border-radius: var(--border-radius-small);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
}

// 兼容 Element 控件在暗淡磨砂背景下的颜色样式
:deep(.el-input) {
  --el-input-bg-color: rgba(255, 255, 255, 0.05);
  --el-input-border-color: rgba(255, 255, 255, 0.1);
  --el-input-text-color: #ffffff;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.3);
  
  .el-input__wrapper {
    box-shadow: none !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-small);
    &:hover {
      border-color: var(--primary-color);
    }
    &.is-focus {
      border-color: var(--primary-color);
    }
  }
}

@media (max-width: 992px) {
  .login-card {
    width: 420px;
    height: 520px;
    .card-right {
      padding: 30px;
    }
  }
}
</style>
