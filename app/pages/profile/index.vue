<!-- app/pages/profile/index.vue -->
<template>
  <page-container title="个人中心" subtitle="管理及完善您的个人账户信息，进行密码重置。">
    <el-row :gutter="16">
      <!-- 左侧：个人名片 -->
      <el-col :xs="24" :md="8" class="mb-4">
        <el-card shadow="never" class="profile-card flex-center">
          <div class="profile-avatar flex-center">
            <el-avatar :size="100" :src="avatarUrl" />
          </div>
          <h2 class="profile-nickname">{{ nickname }}</h2>
          <p class="profile-username">@{{ username }}</p>
          <div class="profile-meta-list w-full">
            <div class="meta-item flex-between">
              <span class="label flex-center"><el-icon><Phone /></el-icon> 手机号码</span>
              <span class="value">{{ phone }}</span>
            </div>
            <div class="meta-item flex-between">
              <span class="label flex-center"><el-icon><Message /></el-icon> 电子邮箱</span>
              <span class="value">{{ email }}</span>
            </div>
            <div class="meta-item flex-between">
              <span class="label flex-center"><el-icon><User /></el-icon> 所属角色</span>
              <span class="value">
                <el-tag v-for="r in roles" :key="r" size="small" class="ml-1">{{ r }}</el-tag>
              </span>
            </div>
            <div class="meta-item flex-between">
              <span class="label flex-center"><el-icon><Calendar /></el-icon> 注册时间</span>
              <span class="value">{{ createTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：更新设置 -->
      <el-col :xs="24" :md="16">
        <el-card shadow="never" class="settings-card">
          <el-tabs v-model="activeTab">
            <!-- 修改个人资料 -->
            <el-tab-pane label="基本资料" name="profile">
              <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px" class="profile-form">
                <el-form-item label="用户昵称" prop="nickname">
                  <el-input v-model="profileForm.nickname" />
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="profileForm.phone" />
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="profileForm.email" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="saveLoading" @click="handleSaveProfile">保存修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 修改登录密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px" class="profile-form">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="pwdLoading" @click="handleSavePassword">确认重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '~/stores/modules/user';
import PageContainer from '~/components/common/PageContainer.vue';
import { Phone, Message, User, Calendar } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

definePageMeta({
  title: '个人中心',
});

const userStore = useUserStore();

const activeTab = ref('profile');
const saveLoading = ref(false);
const pwdLoading = ref(false);

const profileFormRef = ref();
const pwdFormRef = ref();

const avatarUrl = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const nickname = computed(() => userStore.userInfo?.nickname || '管理员');
const username = computed(() => userStore.userInfo?.username || 'admin');
const phone = computed(() => userStore.userInfo?.phone || '—');
const email = computed(() => userStore.userInfo?.email || '—');
const roles = computed(() => userStore.userInfo?.roles || []);
const createTime = computed(() => userStore.userInfo?.createTime || '—');

const profileForm = reactive({
  nickname: nickname.value,
  phone: phone.value,
  email: email.value,
});

const profileRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
};

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== pwdForm.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

const handleSaveProfile = async () => {
  if (!profileFormRef.value) return;
  await profileFormRef.value.validate((valid: boolean) => {
    if (valid) {
      saveLoading.value = true;
      setTimeout(() => {
        if (userStore.userInfo) {
          userStore.userInfo.nickname = profileForm.nickname;
          userStore.userInfo.phone = profileForm.phone;
          userStore.userInfo.email = profileForm.email;
        }
        saveLoading.value = false;
        ElMessage.success('个人资料修改成功！');
      }, 1000);
    }
  });
};

const handleSavePassword = async () => {
  if (!pwdFormRef.value) return;
  await pwdFormRef.value.validate((valid: boolean) => {
    if (valid) {
      pwdLoading.value = true;
      setTimeout(() => {
        pwdLoading.value = false;
        pwdForm.oldPassword = '';
        pwdForm.newPassword = '';
        pwdForm.confirmPassword = '';
        ElMessage.success('密码重置成功！');
      }, 1000);
    }
  });
};
</script>

<style scoped lang="scss">
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  min-height: 400px;
  
  .profile-nickname {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-main);
    margin: 16px 0 4px 0;
  }
  
  .profile-username {
    font-size: 13px;
    color: var(--text-placeholder);
    margin: 0 0 28px 0;
  }

  .profile-meta-list {
    border-top: 1px solid var(--border-color);
    padding-top: 16px;
    
    .meta-item {
      padding: 10px 0;
      font-size: 13px;
      
      .label {
        gap: 6px;
        color: var(--text-regular);
      }
      
      .value {
        color: var(--text-main);
        font-weight: 500;
      }
    }
  }
}

.settings-card {
  min-height: 400px;
  
  .profile-form {
    max-width: 480px;
    padding-top: 16px;
  }
}

.mb-4 {
  margin-bottom: 16px;
}
.ml-1 {
  margin-left: 4px;
}
</style>
