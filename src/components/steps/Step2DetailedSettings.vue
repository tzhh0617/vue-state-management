<template>
  <div class="step-content">
    <h3>第二步：详细设置</h3>
    <el-form 
      ref="formRef"
      :model="step2.formData" 
      label-width="80px"
      @submit.prevent
    >
      <el-form-item 
        label="描述" 
        prop="description"
        :rules="[
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 10, message: '描述至少10个字符', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="step2.formData.description"
          type="textarea"
          :rows="4"
          placeholder="请详细描述项目/任务内容"
          @blur="handleValidation"
        />
      </el-form-item>
      
      <el-form-item 
        label="标签" 
        v-if="step2.dynamicOptions.tags.length > 0"
      >
        <el-select
          v-model="step2.formData.tags"
          multiple
          placeholder="请选择相关标签"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in step2.dynamicOptions.tags"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item 
        label="优先级" 
        prop="priority"
        :rules="[
          { required: true, message: '请选择优先级', trigger: 'change' }
        ]"
      >
        <el-radio-group v-model="step2.formData.priority" @change="handleValidation">
          <el-radio
            v-for="option in step2.baseOptions.priorities"
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
import { ref, onMounted } from 'vue'

const props = defineProps({
  step2: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate'])

const formRef = ref(null)

// 将form引用注册到step2 hook中
onMounted(() => {
  if (props.step2?.setFormRef && formRef.value) {
    props.step2.setFormRef(formRef.value)
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
