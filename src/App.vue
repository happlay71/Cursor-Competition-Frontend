<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
}

/* 重置一些基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 确保路由视图占满空间 */
.el-config-provider {
  width: 100%;
  height: 100%;
}
</style>
