<script setup lang="ts">
import { reactive } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
// import { CodeDiff } from "v-code-diff";  // 已注释：依赖已移除，避免构建失败

const info = reactive({
  title: "文本对比",
  leftTxt: '旧文本',
  rightTxt: '新文本'
})

// copy 功能已注释，如果以后需要再打开
// const copyRes = async (resStr: string) => {
//   copy(resStr)
// }
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>
    <div class="">
      <div class="flex justify-between mb-4">
        <el-input
          type="textarea"
          :rows="16"
          v-model="info.leftTxt"
          placeholder="请输入旧文本..."
        />
        <el-input
          type="textarea"
          :rows="16"
          v-model="info.rightTxt"
          placeholder="请输入新文本..."
          class="ml-3"
        />
      </div>

      <!-- 原代码差异对比组件已禁用（依赖 v-code-diff 已移除） -->
      <!-- <code-diff
        :old-string="info.leftTxt"
        :new-string="info.rightTxt"
        output-format="side-by-side"
        theme="dark"
      /> -->

      <!-- 占位提示：让用户知道功能暂不可用 -->
      <div class="mt-6 p-6 bg-gray-800/80 text-white rounded-lg border border-gray-700 text-center">
        <h3 class="text-xl font-semibold mb-2">文本差异对比功能暂不可用</h3>
        <p class="text-gray-300">
          正在维护升级中，敬请期待后续版本～<br />
          目前您可以继续使用其他工具（如 JSON 格式化、时间戳转换、二维码生成等）。
        </p>
      </div>
    </div>

    <!-- 描述 -->
    <ToolDetail title="描述">
      <el-text>
        在线文本差异比对支持中文、英文、代码比对，不限制字数轻松比对文本。
      </el-text>
    </ToolDetail>
  </div>
</template>

<style scoped>
/* 可选：添加一些提示样式 */
.mt-6 {
  margin-top: 1.5rem;
}
</style>
