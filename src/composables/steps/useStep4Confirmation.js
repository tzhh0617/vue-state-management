import { ref, reactive, computed } from 'vue'

export function useStep4Confirmation() {
  // 表单数据
  const formData = reactive({
    confirmed: false,
    notes: ''
  })

  // 表单引用
  const formRef = ref(null)

  // 验证状态
  const isValid = ref(false)

  // 表单规则 - 返回函数以支持动态规则
  const getValidationRules = () => ({
    confirmed: [
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
    ]
  })

  // 计算属性
  const canSubmit = computed(() => {
    return formData.confirmed === true
  })

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
    formData.confirmed = false
    formData.notes = ''
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
    formRef,

    // 状态
    isValid,
    canSubmit,

    // 方法
    validateForm,
    resetForm,
    setFormRef,
    getValidationRules
  }
}
