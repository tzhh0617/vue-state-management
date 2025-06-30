import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStep1BasicInfo } from './steps/useStep1BasicInfo.js'
import { useStep2DetailedSettings } from './steps/useStep2DetailedSettings.js'
import { useStep3Assignment } from './steps/useStep3Assignment.js'
import { useStep4Confirmation } from './steps/useStep4Confirmation.js'

// 配置常量
const FORM_CONFIG = {
  TOTAL_STEPS: 4,
  STEP_LABELS: ['基本信息', '详细设置', '分配确认', '最终确认']
}

export function useMultiStepFormNew() {
  // 弹窗控制
  const dialogVisible = ref(false)
  
  // 当前步骤
  const currentStep = ref(1)
  const totalSteps = FORM_CONFIG.TOTAL_STEPS

  // 初始化各步骤的hooks
  const step1 = useStep1BasicInfo()
  const step2 = useStep2DetailedSettings(step1.formData)
  const step3 = useStep3Assignment(step2.formData)
  const step4 = useStep4Confirmation()

  // 步骤映射
  const steps = {
    1: step1,
    2: step2,
    3: step3,
    4: step4
  }

  // 计算属性
  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === totalSteps)
  const currentStepLabel = computed(() => FORM_CONFIG.STEP_LABELS[currentStep.value - 1])
  const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)
  
  // 当前步骤是否可以继续
  const canGoNext = computed(() => {
    const current = steps[currentStep.value]
    return current?.canGoNext?.value || current?.canSubmit?.value || false
  })

  // 主要方法
  const openDialog = () => {
    dialogVisible.value = true
    resetAllSteps()
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    resetAllSteps()
  }
  
  const resetAllSteps = () => {
    currentStep.value = 1
    step1.resetForm()
    step2.resetForm()
    step3.resetForm()
    step4.resetForm()
  }

  // 验证当前步骤
  const validateCurrentStep = async () => {
    const current = steps[currentStep.value]
    if (current?.validateForm) {
      return await current.validateForm()
    }
    return false
  }

  // 下一步
  const nextStep = async () => {
    if (await validateCurrentStep() && currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  // 上一步
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // 跳转到指定步骤
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }

  // 提交表单
  const submitForm = async () => {
    if (!await validateCurrentStep()) {
      ElMessage.warning('请先完成当前步骤的信息填写')
      return false
    }
    
    try {
      // 收集所有步骤的数据
      const finalData = {
        基本信息: {
          名称: step1.formData.name,
          类型: step1.formData.type,
          分类: step1.formData.category
        },
        详细设置: {
          描述: step2.formData.description,
          标签: step2.formData.tags,
          优先级: step2.formData.priority
        },
        分配信息: {
          负责人: step3.formData.assignee,
          截止日期: step3.formData.deadline,
          预算: step3.formData.budget
        },
        确认信息: {
          已确认: step4.formData.confirmed,
          备注: step4.formData.notes
        }
      }
      
      console.log('提交表单数据:', finalData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      ElMessage.success('创建成功！')
      closeDialog()
      return true
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('创建失败，请重试')
      return false
    }
  }

  return {
    // 状态
    dialogVisible,
    currentStep,
    totalSteps,
    
    // 各步骤实例
    step1,
    step2,
    step3,
    step4,
    
    // 计算属性
    isFirstStep,
    isLastStep,
    canGoNext,
    progressPercentage,
    currentStepLabel,
    
    // 配置
    formConfig: FORM_CONFIG,
    
    // 方法
    openDialog,
    closeDialog,
    resetAllSteps,
    validateCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  }
}
