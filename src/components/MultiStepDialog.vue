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
      <Step1BasicInfo
        v-show="currentStep === 1"
        :step1="step1"
        @validate="validateCurrentStep"
      />

      <!-- 第二步：详细设置 -->
      <Step2DetailedSettings
        v-show="currentStep === 2"
        :step2="step2"
        @validate="validateCurrentStep"
      />

      <!-- 第三步：分配确认 -->
      <Step3Assignment
        v-show="currentStep === 3"
        :step3="step3"
        @validate="validateCurrentStep"
      />

      <!-- 第四步：最终确认 -->
      <Step4Confirmation
        v-show="currentStep === 4"
        :step4="step4"
        :all-form-data="{ step1: step1.formData, step2: step2.formData, step3: step3.formData }"
        :step1="step1"
        :step2="step2"
        :step3="step3"
        @validate="validateCurrentStep"
      />
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
import { useMultiStepFormNew } from '../composables/useMultiStepFormNew.js'
import {
  Step1BasicInfo,
  Step2DetailedSettings,
  Step3Assignment,
  Step4Confirmation
} from './steps/index.js'

const {
  dialogVisible,
  currentStep,
  totalSteps,
  step1,
  step2,
  step3,
  step4,
  isFirstStep,
  isLastStep,
  canGoNext,
  progressPercentage,
  openDialog,
  closeDialog,
  validateCurrentStep,
  nextStep,
  prevStep,
  submitForm
} = useMultiStepFormNew()

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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-steps) {
  padding: 0 20px;
}
</style>
