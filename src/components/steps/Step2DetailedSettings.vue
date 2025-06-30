<template>
  <div class="step-content">
    <h3>第二步：详细设置</h3>
    <el-form :model="formData" :rules="validationRules" label-width="80px">
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请详细描述项目/任务内容"
          @blur="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="标签" v-if="dynamicOptions.tags.length > 0">
        <el-select
          v-model="formData.tags"
          multiple
          placeholder="请选择相关标签"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in dynamicOptions.tags"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="优先级" prop="priority">
        <el-radio-group v-model="formData.priority" @change="handleValidation">
          <el-radio
            v-for="option in baseOptions.priorities"
            :key="option.value"
            :value="option.value"
            border
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
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
