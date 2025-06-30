<template>
  <div class="step-content">
    <h3>第一步：基本信息</h3>
    <el-form :model="formData" :rules="validationRules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入项目/任务名称"
          @blur="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择类型"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in baseOptions.types"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="分类" prop="category" v-if="dynamicOptions.categories.length > 0">
        <el-select
          v-model="formData.category"
          placeholder="请选择分类"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in dynamicOptions.categories"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
defineProps({
  formData: {
    type: Object,
    required: true
  },
  validationRules: {
    type: Object,
    required: true
  },
  baseOptions: {
    type: Object,
    required: true
  },
  dynamicOptions: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate'])

const handleValidation = () => {
  emit('validate')
}
</script>

<style scoped>
.step-content {
  padding: 0 20px;
}

.step-content h3 {
  margin-bottom: 20px;
  color: #409eff;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
