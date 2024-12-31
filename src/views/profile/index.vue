<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <el-avatar :size="120" :src="userStore.userInfo?.avatarUrl" class="user-avatar">
          {{ userStore.userInfo?.userAccount?.charAt(0)?.toUpperCase() }}
        </el-avatar>
      </div>

      <!-- 用户信息区域 -->
      <div class="info-section">
        <div class="info-item">
          <span class="label">账号</span>
          <span class="value">{{ userStore.userInfo?.userAccount }}</span>
        </div>
        <div class="info-item">
          <span class="label">昵称</span>
          <span class="value">{{ userStore.userInfo?.username || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">职责</span>
          <el-tag :type="userStore.isAdmin ? 'danger' : 'success'" size="small">
            {{ userStore.isAdmin ? '管理员' : '普通用户' }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">状态</span>
          <el-tag :type="userStore.userInfo?.status === 0 ? 'success' : 'info'" size="small">
            {{ userStore.userInfo?.status === 0 ? '已启用' : '已禁用' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.profile-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}

.profile-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #6e78c8;
  font-size: 48px;
  color: #fff;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.label {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.value {
  flex: 1;
  color: #333;
  font-size: 16px;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
}
</style>
