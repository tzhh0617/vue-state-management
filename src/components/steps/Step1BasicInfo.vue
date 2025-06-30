<template>
  <div class="step-content">
    <h3>第一步：基本信息</h3>
    <el-form 
      ref="formRef"
      :model="step1.formData" 
      label-width="80px"
      @submit.prevent
    >
      <el-form-item 
        label="名称" 
        prop="name"
        :rules="[
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="step1.formData.name"
          placeholder="请输入项目/任务名称"
          @blur="handleValidation"
        />
      </el-form-item>
      
      <el-form-item 
        label="类型" 
        prop="type"
        :rules="[
          { required: true, message: '请选择类型', trigger: 'change' }
        ]"
      >
        <el-select
          v-model="step1.formData.type"
          placeholder="请选择类型"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in step1.baseOptions.types"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item 
        label="分类" 
        prop="category" 
        v-if="step1.dynamicOptions.categories.length > 0"
        :rules="[
          { required: true, message: '请选择分类', trigger: 'change' }
        ]"
      >
        <el-select
          v-model="step1.formData.category"
          placeholder="请选择分类"
          style="width: 100%"
          @change="handleValidation"
        >
          <el-option
            v-for="option in step1.dynamicOptions.categories"
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
import { ref, onMounted } from 'vue'

const props = defineProps({
  step1: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate'])

const formRef = ref(null)

// 将form引用注册到step1 hook中
onMounted(() => {
  if (props.step1?.setFormRef && formRef.value) {
    props.step1.setFormRef(formRef.value)
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
