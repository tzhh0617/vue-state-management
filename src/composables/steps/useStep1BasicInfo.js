import { ref, reactive, computed, watch } from 'vue'

// 基础选项数据
const BASE_OPTIONS = {
  types: [
    { label: '项目', value: 'project' },
    { label: '任务', value: 'task' }
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
  }
}

export function useStep1BasicInfo() {
  // 表单数据
  const formData = reactive({
    name: '',
    type: '',
    category: ''
  })

  // 表单引用
  const formRef = ref(null)

  // 验证状态
  const isValid = ref(false)

  // 动态选项
  const dynamicOptions = reactive({
    categories: []
  })

  // 表单规则 - 返回函数以支持动态规则
  const getValidationRules = () => ({
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
  })

  // 计算属性
  const canGoNext = computed(() => {
    return formData.name && 
           formData.type && 
           formData.category &&
           formData.name.length >= 2 &&
           formData.name.length <= 50
  })

  // 更新分类选项
  const updateCategoriesOptions = (type) => {
    dynamicOptions.categories = DYNAMIC_OPTIONS_CONFIG.categories[type] || []
    formData.category = ''
  }

  // 监听器
  watch(() => formData.type, updateCategoriesOptions)

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
    formData.name = ''
    formData.type = ''
    formData.category = ''
    dynamicOptions.categories = []
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
