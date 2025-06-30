<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import MultiStepDialog from './components/MultiStepDialog.vue'

// 弹窗组件引用
const multiStepDialogRef = ref(null)

// 创建按钮点击事件
const handleCreate = () => {
  multiStepDialogRef.value?.openDialog()
}
</script>

<template>
  <div id="app">
    <el-button 
      type="primary" yp
      size="large"
      @click="handleCreate"
    >
      <el-icon>
        <Plus />
      </el-icon>
      创建项目/任务
    </el-button>

    <!-- 多步骤弹窗组件 -->
    <MultiStepDialog ref="multiStepDialogRef" />
  </div>
</template>

<style scoped>
/* 样式已移除 */
</style>
