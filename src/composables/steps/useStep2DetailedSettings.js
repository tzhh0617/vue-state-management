import { ref, reactive, computed, watch } from 'vue'

// 基础选项数据
const BASE_OPTIONS = {
  priorities: [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ]
}

// 动态选项配置
const DYNAMIC_OPTIONS_CONFIG = {
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
  }
}

export function useStep2DetailedSettings(step1FormData) {
  // 表单数据
  const formData = reactive({
    description: '',
    tags: [],
    priority: 'medium'
  })

  // 表单引用
  const formRef = ref(null)

  // 验证状态
  const isValid = ref(false)

  // 动态选项
  const dynamicOptions = reactive({
    tags: []
  })

  // 表单规则 - 返回函数以支持动态规则
  const getValidationRules = () => ({
    description: [
      { required: true, message: '请输入描述', trigger: 'blur' },
      { min: 10, message: '描述至少10个字符', trigger: 'blur' }
    ],
    priority: [
      { required: true, message: '请选择优先级', trigger: 'change' }
    ]
  })

  // 计算属性
  const canGoNext = computed(() => {
    return formData.description && 
           formData.description.length >= 10 &&
           formData.priority
  })

  // 更新标签选项
  const updateTagsOptions = (category) => {
    dynamicOptions.tags = DYNAMIC_OPTIONS_CONFIG.tags[category] || DYNAMIC_OPTIONS_CONFIG.tags.default
    formData.tags = []
  }

  // 监听器 - 监听第一步的分类变化
  watch(() => step1FormData?.category, updateTagsOptions, { immediate: true })

  // 验证表单
  const validateForm = async () => {
    if (!formRef.value) return false
    
    try {
      await formRef.value.validate()
      isValid.value = true
      return true
    } catch (error) {
      isValid.value = false
      return false
    }
  }

  // 重置表单
  const resetForm = () => {
    formData.description = ''
    formData.tags = []
    formData.priority = 'medium'
    dynamicOptions.tags = []
    isValid.value = false
    
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // 设置表单引用
  const setFormRef = (ref) => {
    formRef.value = ref
  }

  return {
    // 数据
    formData,
    dynamicOptions,
    baseOptions: BASE_OPTIONS,
    formRef,

    // 状态
    isValid,
    canGoNext,

    // 方法
    validateForm,
    resetForm,
    setFormRef,
    getValidationRules
  }
}
