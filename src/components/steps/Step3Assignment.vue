<template>
  <div class="step-content">
    <h3>第三步：分配确认</h3>
    <el-form :model="formData" :rules="validationRules" label-width="80px">
      <el-form-item label="负责人" prop="assignee" v-if="dynamicOptions.assignees.length > 0">
        <el-select
          v-model="formData.assignee"
          placeholder="请选择负责人"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in dynamicOptions.assignees"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="截止日期" prop="deadline">
        <el-date-picker
          v-model="formData.deadline"
          type="date"
          placeholder="请选择截止日期"
          style="width: 100%"
          @change="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="预算">
        <el-input-number
          v-model="formData.budget"
          :min="0"
          :step="1000"
          step-strictly
          controls-position="right"
          style="width: 100%"
        />
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
