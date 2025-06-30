import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 配置常量
const FORM_CONFIG = {
  TOTAL_STEPS: 4,
  STEP_LABELS: ['基本信息', '详细设置', '分配确认', '最终确认']
}

// 基础选项数据
const BASE_OPTIONS = {
  types: [
    { label: '项目', value: 'project' },
    { label: '任务', value: 'task' }
  ],
  priorities: [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ]
}

// 动态选项配置
const DYNAMIC_OPTIONS_CONFIG = {
  categories: {
    project: [
      { label: '技术项目', value: 'tech' },
      { label: '产品项目', value: 'product' },
      { label: '运营项目', value: 'operation' }
    ],
    task: [
      { label: '开发任务', value: 'development' },
      { label: '测试任务', value: 'testing' },
      { label: '部署任务', value: 'deployment' }
    ]
  },
  tags: {
    tech: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'TypeScript', value: 'typescript' }
    ],
    development: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'TypeScript', value: 'typescript' }
    ],
    product: [
      { label: 'UI/UX', value: 'uiux' },
      { label: '用户研究', value: 'research' },
      { label: '数据分析', value: 'analysis' }
    ],
    testing: [
      { label: 'UI/UX', value: 'uiux' },
      { label: '用户研究', value: 'research' },
      { label: '数据分析', value: 'analysis' },
      { label: '自动化测试', value: 'automation' }
    ],
    default: [
      { label: '市场推广', value: 'marketing' },
      { label: '内容创作', value: 'content' },
      { label: '社交媒体', value: 'social' }
    ]
  },
  assignees: {
    high: [
      { label: '张三（高级开发）', value: 'zhangsan' },
      { label: '李四（技术专家）', value: 'lisi' },
      { label: '王五（项目经理）', value: 'wangwu' }
    ],
    medium: [
      { label: '赵六（中级开发）', value: 'zhaoliu' },
      { label: '钱七（产品经理）', value: 'qianqi' },
      { label: '孙八（测试工程师）', value: 'sunba' }
    ],
    low: [
      { label: '周九（初级开发）', value: 'zhoujiu' },
      { label: '吴十（实习生）', value: 'wushi' }
    ]
  }
}

// 表单验证规则
const VALIDATION_RULES = {
  step1: {
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择类型', trigger: 'change' }
    ],
    category: [
      { required: true, message: '请选择分类', trigger: 'change' }
    ]
  },
  step2: {
    description: [
      { required: true, message: '请输入描述', trigger: 'blur' },
      { min: 10, message: '描述至少10个字符', trigger: 'blur' }
    ],
    priority: [
      { required: true, message: '请选择优先级', trigger: 'change' }
    ]
  },
  step3: {
    assignee: [
      { required: true, message: '请选择负责人', trigger: 'change' }
    ],
    deadline: [
      { required: true, message: '请选择截止日期', trigger: 'change' }
    ]
  },
  step4: {
    confirmed: [
      { required: true, message: '请确认信息无误', trigger: 'change' }
    ]
  }
}

// 工具函数
const createInitialFormData = () => ({
  step1: {
    name: '',
    type: '',
    category: ''
  },
  step2: {
    description: '',
    tags: [],
    priority: 'medium'
  },
  step3: {
    assignee: '',
    deadline: '',
    budget: 0
  },
  step4: {
    confirmed: false,
    notes: ''
  }
})

const createInitialStepValidation = () => ({
  step1: false,
  step2: false,
  step3: false,
  step4: false
})

const createInitialDynamicOptions = () => ({
  categories: [],
  assignees: [],
  tags: []
})

export function useMultiStepForm() {
  // 弹窗控制
  const dialogVisible = ref(false)
  
  // 当前步骤
  const currentStep = ref(1)
  const totalSteps = FORM_CONFIG.TOTAL_STEPS
  
  // 各步骤的表单数据
  const formData = reactive(createInitialFormData())
  
  // 各步骤的验证规则
  const validationRules = reactive(VALIDATION_RULES)
  
  // 各步骤的验证状态
  const stepValidation = reactive(createInitialStepValidation())
  
  // 动态选项数据（根据前一步的选择变化）
  const dynamicOptions = reactive(createInitialDynamicOptions())
  
  // 工具函数：更新动态选项
  const updateCategoriesOptions = (type) => {
    dynamicOptions.categories = DYNAMIC_OPTIONS_CONFIG.categories[type] || []
    formData.step1.category = ''
  }
  
  const updateTagsOptions = (category) => {
    dynamicOptions.tags = DYNAMIC_OPTIONS_CONFIG.tags[category] || DYNAMIC_OPTIONS_CONFIG.tags.default
    formData.step2.tags = []
  }
  
  const updateAssigneesOptions = (priority) => {
    dynamicOptions.assignees = DYNAMIC_OPTIONS_CONFIG.assignees[priority] || []
    formData.step3.assignee = ''
  }
  
  // 监听器：数据联动
  watch(() => formData.step1.type, updateCategoriesOptions)
  watch(() => formData.step1.category, updateTagsOptions)
  watch(() => formData.step2.priority, updateAssigneesOptions)
  
  // 计算属性
  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === totalSteps)
  const canGoNext = computed(() => stepValidation[`step${currentStep.value}`])
  const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)
  const currentStepLabel = computed(() => FORM_CONFIG.STEP_LABELS[currentStep.value - 1])
  
  // 数据重置函数
  const resetFormData = () => {
    Object.assign(formData, createInitialFormData())
  }
  
  const resetStepValidation = () => {
    Object.assign(stepValidation, createInitialStepValidation())
  }
  
  const resetDynamicOptions = () => {
    Object.assign(dynamicOptions, createInitialDynamicOptions())
  }
  
  // 主要方法
  const openDialog = () => {
    dialogVisible.value = true
    resetForm()
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    resetForm()
  }
  
  const resetForm = () => {
    currentStep.value = 1
    resetFormData()
    resetStepValidation()
    resetDynamicOptions()
  }
  
  const validateCurrentStep = () => {
    const currentStepKey = `step${currentStep.value}`
    const currentFormData = formData[currentStepKey]
    const currentRules = validationRules[currentStepKey]
    
    let isValid = true
    
    for (const field in currentRules) {
      const value = currentFormData[field]
      const rules = currentRules[field]
      
      for (const rule of rules) {
        if (rule.required && (!value || (Array.isArray(value) && value.length === 0) || value === false)) {
          isValid = false
          break
        }
        if (rule.min && typeof value === 'string' && value.length < rule.min) {
          isValid = false
          break
        }
        if (rule.max && typeof value === 'string' && value.length > rule.max) {
          isValid = false
          break
        }
      }
      
      if (!isValid) break
    }
    
    stepValidation[currentStepKey] = isValid
    return isValid
  }
  
  const nextStep = () => {
    if (validateCurrentStep() && currentStep.value < totalSteps) {
      currentStep.value++
    }
  }
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }
  
  const submitForm = async () => {
    if (!validateCurrentStep()) {
      ElMessage.warning('请先完成当前步骤的信息填写')
      return false
    }
    
    try {
      // 最终数据整理
      const finalData = {
        基本信息: {
          名称: formData.step1.name,
          类型: formData.step1.type,
          分类: formData.step1.category
        },
        详细设置: {
          描述: formData.step2.description,
          标签: formData.step2.tags,
          优先级: formData.step2.priority
        },
        分配信息: {
          负责人: formData.step3.assignee,
          截止日期: formData.step3.deadline,
          预算: formData.step3.budget
        },
        确认信息: {
          已确认: formData.step4.confirmed,
          备注: formData.step4.notes
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
    formData,
    validationRules,
    stepValidation,
    dynamicOptions,
    baseOptions: BASE_OPTIONS,
    
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
    resetForm,
    validateCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  }
}
