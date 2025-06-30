import { ref, reactive, computed, watch } from 'vue'

// 动态选项配置
const DYNAMIC_OPTIONS_CONFIG = {
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

export function useStep3Assignment(step2FormData) {
  // 表单数据
  const formData = reactive({
    assignee: '',
    deadline: '',
    budget: 0
  })

  // 表单引用
  const formRef = ref(null)

  // 验证状态
  const isValid = ref(false)

  // 动态选项
  const dynamicOptions = reactive({
    assignees: []
  })

  // 表单规则 - 返回函数以支持动态规则
  const getValidationRules = () => ({
    assignee: [
      { required: true, message: '请选择负责人', trigger: 'change' }
    ],
    deadline: [
      { required: true, message: '请选择截止日期', trigger: 'change' }
    ]
  })

  // 计算属性
  const canGoNext = computed(() => {
    return formData.assignee && formData.deadline
  })

  // 更新负责人选项
  const updateAssigneesOptions = (priority) => {
    dynamicOptions.assignees = DYNAMIC_OPTIONS_CONFIG.assignees[priority] || []
    formData.assignee = ''
  }

  // 监听器 - 监听第二步的优先级变化
  watch(() => step2FormData?.priority, updateAssigneesOptions, { immediate: true })

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
    formData.assignee = ''
    formData.deadline = ''
    formData.budget = 0
    dynamicOptions.assignees = []
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
