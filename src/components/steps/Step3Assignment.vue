<template>
  <div class="step-content">
    <h3>第三步：分配确认</h3>
    <el-form 
      ref="formRef"
      :model="step3.formData" 
      label-width="80px"
      @submit.prevent
    >
      <el-form-item 
        label="负责人" 
        prop="assignee" 
        v-if="step3.dynamicOptions.assignees.length > 0"
        :rules="[
          { required: true, message: '请选择负责人', trigger: 'change' }
        ]"
      >
        <el-select
          v-model="step3.formData.assignee"
          placeholder="请选择负责人"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in step3.dynamicOptions.assignees"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item 
        label="截止日期" 
        prop="deadline"
        :rules="[
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ]"
      >
        <el-date-picker
          v-model="step3.formData.deadline"
          type="date"
          placeholder="请选择截止日期"
          style="width: 100%"
          @change="handleValidation"
        />
      </el-form-item>
      
      <el-form-item label="预算">
        <el-input-number
          v-model="step3.formData.budget"
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
import { ref, onMounted } from 'vue'

const props = defineProps({
  step3: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate'])

const formRef = ref(null)

// 将form引用注册到step3 hook中
onMounted(() => {
  if (props.step3?.setFormRef && formRef.value) {
    props.step3.setFormRef(formRef.value)
  }
})

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
