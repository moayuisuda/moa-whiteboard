# codesign-XD
## codesign的XD插件
`npm run dev`: 只是自动build，还是需要手动刷新xd插件

### Tips
* <不是浏览器环境>，canvas不可用，bom实现有差异，vue生态部分可用，npm包部分可用
* block布局和浏览器会有所不同，https://adobexdplatform.com/plugin-docs/reference/ui/layout/block.html，尽量使用flex布局

### 更新记录
* V1.3
  * 添加绑定手机引导
  * 二维码可无交互生成
  * 状态存储优化
  * 交互优化
  * V1.3.1
    * 修复名称带斜杠的切图导出问题
  * V1.3.2
    * 添加全局网络错误提示
    * 修复没有启用的样式标注问题