# 多步骤表单重构说明

## 架构概述

原有的单一composable已经重构为按步骤拆分的多个hooks，每个步骤都有独立的表单实例和校验逻辑。

## 新的文件结构

```
src/composables/
├── useMultiStepFormNew.js          # 主要协调器
└── steps/
    ├── index.js                    # 步骤hooks统一导出
    ├── useStep1BasicInfo.js        # 第一步：基本信息
    ├── useStep2DetailedSettings.js # 第二步：详细设置
    ├── useStep3Assignment.js       # 第三步：分配确认
    └── useStep4Confirmation.js     # 第四步：最终确认
```

## 主要改进

### 1. 按步骤拆分hooks
- 每个步骤都有独立的composable
- 各步骤的表单数据、验证逻辑、动态选项都独立管理
- 更好的代码组织和维护性

### 2. 表单规则直接配置在form-item上
- 不再使用统一的rules对象
- 规则直接写在`:rules="[...]"`属性中
- 支持更灵活的动态字段配置

### 3. 独立的表单实例
- 每个步骤都有自己的表单引用（formRef）
- 使用Element Plus的原生表单验证
- 更准确的验证反馈

### 4. 步骤间数据联动
- 第二步监听第一步的分类变化来更新标签选项
- 第三步监听第二步的优先级变化来更新负责人选项
- 通过watch实现响应式数据联动

## 使用示例

### 在组件中使用新的hooks

```vue
<script setup>
import { useMultiStepFormNew } from '../composables/useMultiStepFormNew.js'

const {
  dialogVisible,
  currentStep,
  step1,
  step2,
  step3,
  step4,
  isFirstStep,
  isLastStep,
  canGoNext,
  openDialog,
  closeDialog,
  nextStep,
  prevStep,
  submitForm
} = useMultiStepFormNew()
</script>
```

### 在步骤组件中配置动态规则

```vue
<template>
  <el-form-item 
    label="名称" 
    prop="name"
    :rules="[
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ]"
  >
    <el-input v-model="step1.formData.name" />
  </el-form-item>
</template>
```

## 动态字段支持

新架构天然支持动态字段：

1. **条件显示字段**：使用v-if控制字段显示
2. **动态验证规则**：直接在:rules中写入条件逻辑
3. **动态选项**：通过watch监听其他字段变化来更新选项

## 优势

1. **更好的代码组织**：每个步骤独立管理，职责清晰
2. **更灵活的验证**：规则直接配置在字段上，支持动态配置
3. **更好的类型安全**：TypeScript支持更好
4. **更容易测试**：每个步骤可以独立测试
5. **更好的维护性**：修改某个步骤不会影响其他步骤
