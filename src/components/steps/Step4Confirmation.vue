<template>
  <div class="step-content">
    <h3>第四步：最终确认</h3>
    
    <!-- 完整数据预览 -->
    <div class="data-preview">
      <h4>📋 信息预览</h4>
      <el-descriptions border :column="1" size="default">
        <el-descriptions-item label="项目/任务名称">
          <el-tag size="large" type="primary">{{ allFormData.step1.name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="类型">{{ getTypeLabel(allFormData.step1.type) }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ getCategoryLabel(allFormData.step1.category) }}</el-descriptions-item>
        <el-descriptions-item label="描述">
          <div class="description-text">{{ allFormData.step2.description }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="相关标签">
          <div class="tags-container">
            <el-tag 
              v-for="tag in allFormData.step2.tags" 
              :key="tag" 
              size="small" 
              class="tag-item"
              effect="light"
            >
              {{ getTagLabel(tag) }}
            </el-tag>
            <span v-if="allFormData.step2.tags.length === 0" class="no-data">未选择标签</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(allFormData.step2.priority)" size="default">
            {{ getPriorityLabel(allFormData.step2.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="负责人">
          <el-tag type="success" size="default">{{ getAssigneeLabel(allFormData.step3.assignee) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="截止日期">
          <el-tag type="warning" size="default">{{ formatDate(allFormData.step3.deadline) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="预算">
          <el-tag type="info" size="default">¥{{ allFormData.step3.budget.toLocaleString() }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    
    <!-- 确认表单 -->
    <div class="confirmation-form">
      <el-form 
        ref="formRef"
        :model="step4.formData" 
        label-width="80px"
        @submit.prevent
      >
        <el-form-item 
          label="确认信息" 
          prop="confirmed"
          :rules="[
            { 
              required: true, 
              message: '请确认信息无误', 
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (value === true) {
                  callback()
                } else {
                  callback(new Error('请确认信息无误'))
                }
              }
            }
          ]"
        >
          <el-checkbox 
            v-model="step4.formData.confirmed" 
            @change="handleValidation"
            size="large"
          >
            <span class="confirm-text">我已仔细核对以上信息，确认无误</span>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item label="备注信息">
          <el-input
            v-model="step4.formData.notes"
            type="textarea"
            :rows="3"
            placeholder="可选：添加额外的备注信息..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 提交提示 -->
    <div class="submit-notice">
      <el-alert
        title="提交须知"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <p>• 提交后将创建对应的项目/任务</p>
          <p>• 相关人员将收到通知邮件</p>
          <p>• 可在后续管理页面中查看和修改</p>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  step4: {
    type: Object,
    required: true
  },
  allFormData: {
    type: Object,
    required: true
  },
  step1: {
    type: Object,
    required: true
  },
  step2: {
    type: Object,
    required: true
  },
  step3: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validate'])

const formRef = ref(null)

// 将form引用注册到step4 hook中
onMounted(() => {
  if (props.step4?.setFormRef && formRef.value) {
    props.step4.setFormRef(formRef.value)
  }
})

const handleValidation = () => {
  emit('validate')
}

// 辅助方法：获取标签文本
const getTypeLabel = (value) => {
  const option = props.step1.baseOptions.types.find(item => item.value === value)
  return option ? option.label : value
}

const getCategoryLabel = (value) => {
  const option = props.step1.dynamicOptions.categories.find(item => item.value === value)
  return option ? option.label : value
}

const getTagLabel = (value) => {
  const option = props.step2.dynamicOptions.tags.find(item => item.value === value)
  return option ? option.label : value
}

const getPriorityLabel = (value) => {
  const option = props.step2.baseOptions.priorities.find(item => item.value === value)
  return option ? option.label : value
}

const getPriorityType = (value) => {
  const typeMap = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return typeMap[value] || 'info'
}

const getAssigneeLabel = (value) => {
  const option = props.step3.dynamicOptions.assignees.find(item => item.value === value)
  return option ? option.label : value
}

const formatDate = (date) => {
  if (!date) return '未设置'
  if (typeof date === 'string') return date
  return date.toLocaleDateString('zh-CN')
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

.data-preview {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.data-preview h4 {
  margin-bottom: 15px;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.description-text {
  max-width: 300px;
  word-wrap: break-word;
  line-height: 1.5;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tag-item {
  margin: 0 !important;
}

.no-data {
  color: #999;
  font-style: italic;
  font-size: 12px;
}

.confirmation-form {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 2px solid #e1f5fe;
}

.confirm-text {
  font-weight: 500;
  color: #333;
}

.submit-notice {
  margin-top: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-descriptions__body) {
  background-color: white;
}

:deep(.el-descriptions-item__label) {
  font-weight: 600;
  color: #606266;
  width: 120px;
}

:deep(.el-descriptions-item__content) {
  color: #303133;
}

:deep(.el-alert__content) {
  padding-left: 8px;
}

:deep(.el-alert__content p) {
  margin: 4px 0;
  font-size: 13px;
}
</style>
