<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建新项目"
    width="600px"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <el-steps :active="currentStep - 1" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="详细设置" />
        <el-step title="分配确认" />
        <el-step title="最终确认" />
      </el-steps>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar">
      <el-progress :percentage="progressPercentage" />
    </div>

    <!-- 表单内容 -->
    <div class="form-content">
      <!-- 第一步：基本信息 -->
      <div v-show="currentStep === 1" class="step-content">
        <h3>第一步：基本信息</h3>
        <el-form :model="formData.step1" :rules="validationRules.step1" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="formData.step1.name"
              placeholder="请输入项目/任务名称"
              @blur="validateCurrentStep"
            />
          </el-form-item>
          
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="formData.step1.type"
              placeholder="请选择类型"
              style="width: 100%"
              @change="validateCurrentStep"
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
              v-model="formData.step1.category"
              placeholder="请选择分类"
              style="width: 100%"
              @change="validateCurrentStep"
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

      <!-- 第二步：详细设置 -->
      <div v-show="currentStep === 2" class="step-content">
        <h3>第二步：详细设置</h3>
        <el-form :model="formData.step2" :rules="validationRules.step2" label-width="80px">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="formData.step2.description"
              type="textarea"
              :rows="4"
              placeholder="请详细描述项目/任务内容"
              @blur="validateCurrentStep"
            />
          </el-form-item>
          
          <el-form-item label="标签" v-if="dynamicOptions.tags.length > 0">
            <el-select
              v-model="formData.step2.tags"
              multiple
              placeholder="请选择相关标签"
              style="width: 100%"
              @change="validateCurrentStep"
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
            <el-radio-group v-model="formData.step2.priority" @change="validateCurrentStep">
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

      <!-- 第三步：分配确认 -->
      <div v-show="currentStep === 3" class="step-content">
        <h3>第三步：分配确认</h3>
        <el-form :model="formData.step3" :rules="validationRules.step3" label-width="80px">
          <el-form-item label="负责人" prop="assignee" v-if="dynamicOptions.assignees.length > 0">
            <el-select
              v-model="formData.step3.assignee"
              placeholder="请选择负责人"
              style="width: 100%"
              @change="validateCurrentStep"
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
              v-model="formData.step3.deadline"
              type="date"
              placeholder="请选择截止日期"
              style="width: 100%"
              @change="validateCurrentStep"
            />
          </el-form-item>
          
          <el-form-item label="预算">
            <el-input-number
              v-model="formData.step3.budget"
              :min="0"
              :step="1000"
              step-strictly
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 第四步：最终确认 -->
      <div v-show="currentStep === 4" class="step-content">
        <h3>第四步：最终确认</h3>
        
        <!-- 完整数据预览 -->
        <div class="data-preview">
          <h4>📋 信息预览</h4>
          <el-descriptions border :column="1" size="default">
            <el-descriptions-item label="项目/任务名称">
              <el-tag size="large" type="primary">{{ formData.step1.name }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="类型">{{ getTypeLabel(formData.step1.type) }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ getCategoryLabel(formData.step1.category) }}</el-descriptions-item>
            <el-descriptions-item label="描述">
              <div class="description-text">{{ formData.step2.description }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="相关标签">
              <div class="tags-container">
                <el-tag 
                  v-for="tag in formData.step2.tags" 
                  :key="tag" 
                  size="small" 
                  class="tag-item"
                  effect="light"
                >
                  {{ getTagLabel(tag) }}
                </el-tag>
                <span v-if="formData.step2.tags.length === 0" class="no-data">未选择标签</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="优先级">
              <el-tag :type="getPriorityType(formData.step2.priority)" size="default">
                {{ getPriorityLabel(formData.step2.priority) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="负责人">
              <el-tag type="success" size="default">{{ getAssigneeLabel(formData.step3.assignee) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="截止日期">
              <el-tag type="warning" size="default">{{ formatDate(formData.step3.deadline) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="预算">
              <el-tag type="info" size="default">¥{{ formData.step3.budget.toLocaleString() }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 确认表单 -->
        <div class="confirmation-form">
          <el-form :model="formData.step4" :rules="validationRules.step4" label-width="80px">
            <el-form-item label="确认信息" prop="confirmed">
              <el-checkbox 
                v-model="formData.step4.confirmed" 
                @change="validateCurrentStep"
                size="large"
              >
                <span class="confirm-text">我已仔细核对以上信息，确认无误</span>
              </el-checkbox>
            </el-form-item>
            
            <el-form-item label="备注信息">
              <el-input
                v-model="formData.step4.notes"
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
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button v-if="!isFirstStep" @click="prevStep">上一步</el-button>
        <el-button
          v-if="!isLastStep"
          type="primary"
          :disabled="!canGoNext"
          @click="nextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="isLastStep"
          type="primary"
          :disabled="!canGoNext"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useMultiStepForm } from '../composables/useMultiStepForm.js'

const {
  dialogVisible,
  currentStep,
  totalSteps,
  formData,
  validationRules,
  stepValidation,
  dynamicOptions,
  baseOptions,
  isFirstStep,
  isLastStep,
  canGoNext,
  progressPercentage,
  openDialog,
  closeDialog,
  resetForm,
  validateCurrentStep,
  nextStep,
  prevStep,
  goToStep,
  submitForm
} = useMultiStepForm()

// 辅助方法：获取标签文本
const getTypeLabel = (value) => {
  const option = baseOptions.types.find(item => item.value === value)
  return option ? option.label : value
}

const getCategoryLabel = (value) => {
  const option = dynamicOptions.categories.find(item => item.value === value)
  return option ? option.label : value
}

const getTagLabel = (value) => {
  const option = dynamicOptions.tags.find(item => item.value === value)
  return option ? option.label : value
}

const getPriorityLabel = (value) => {
  const option = baseOptions.priorities.find(item => item.value === value)
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
  const option = dynamicOptions.assignees.find(item => item.value === value)
  return option ? option.label : value
}

const formatDate = (date) => {
  if (!date) return '未设置'
  if (typeof date === 'string') return date
  return date.toLocaleDateString('zh-CN')
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
.step-indicator {
  margin-bottom: 20px;
}

.progress-bar {
  margin-bottom: 30px;
}

.form-content {
  min-height: 400px;
}

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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-steps) {
  padding: 0 20px;
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
