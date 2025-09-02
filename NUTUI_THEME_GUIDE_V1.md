# NutUI-React 3.0 CSS Variables 主题配置指南

## 概述

本文档介绍如何使用 NutUI-React 3.0 的方式一：CSS Variables 进行主题配置。

参考官方文档：[NutUI-React 3.0 主题定制](https://nutui.jd.com/taro/react/3x/#/zh-CN/guide/theme-react)

## 配置方式

### 方式一：使用 CSS Variables 进行主题配置

这是推荐的方式，通过 CSS Variables 来定制主题，具有以下优势：

- ✅ 支持运行时动态切换主题
- ✅ 支持暗色主题
- ✅ 配置简单，易于维护
- ✅ 性能优秀

## 文件结构

```
src/
├── assets/
│   └── styles/
│       └── theme.css              # CSS Variables 主题配置文件
├── utils/
│   └── theme.ts                   # 主题切换工具函数
├── components/
│   ├── ThemeDemo.tsx              # 主题演示组件
│   └── ThemeDemo.scss             # 主题演示组件样式
└── app.scss                       # 应用入口样式文件
```

## 配置步骤

### 1. 创建主题配置文件

创建 `src/assets/styles/theme.css` 文件，定义 CSS Variables：

```css
:root {
  /* 主色调 */
  --nutui-color-primary: #1677ff;
  --nutui-color-primary-pressed: #0958d9;
  --nutui-color-primary-disabled: #d9d9d9;
  
  /* 其他颜色变量... */
}

/* 暗色主题 */
[data-theme='dark'] {
  --nutui-color-primary: #1677ff;
  --nutui-color-primary-pressed: #0958d9;
  --nutui-color-primary-disabled: #d9d9d9;
  
  /* 其他暗色主题变量... */
}
```

### 2. 在 app.scss 中引入主题文件

```scss
// 导入 NutUI-React 3.0 CSS Variables 主题配置
@import './assets/styles/theme.css';

// 导入 NutUI 变量
@import '@nutui/nutui-react-taro/dist/styles/variables.scss';
```

### 3. 更新 config/index.ts 配置

```typescript
export default defineConfig({
  // ... 其他配置
  sass: {
    // 注意：现在使用方式一，通过 CSS Variables 进行主题配置
    // 主题变量在 src/assets/styles/theme.css 中定义
  },
  // ... 其他配置
});
```

## 使用方法

### 1. 主题切换

```typescript
import { switchTheme, getCurrentTheme } from '@/utils/theme';

// 切换到暗色主题
switchTheme('dark');

// 切换到浅色主题
switchTheme('light');

// 获取当前主题
const currentTheme = getCurrentTheme(); // 'light' | 'dark'
```

### 2. 动态修改 CSS Variables

```typescript
import { setCSSVariable, setCSSVariables } from '@/utils/theme';

// 修改单个变量
setCSSVariable('color-primary', '#ff4d4f');

// 批量修改变量
setCSSVariables({
  'color-primary': '#ff4d4f',
  'color-success': '#52c41a',
  'color-warning': '#fa8c16',
});
```

### 3. 应用预设主题

```typescript
import { applyThemePreset } from '@/utils/theme';

// 应用预设主题
applyThemePreset('blue');   // 蓝色主题
applyThemePreset('green');  // 绿色主题
applyThemePreset('purple'); // 紫色主题
applyThemePreset('orange'); // 橙色主题
```

### 4. 在组件中使用

```tsx
import React from 'react';
import { Button, Cell } from '@nutui/nutui-react-taro';
import { switchTheme } from '@/utils/theme';

const MyComponent: React.FC = () => {
  const handleThemeSwitch = () => {
    switchTheme('dark');
  };

  return (
    <div>
      <Button onClick={handleThemeSwitch}>切换主题</Button>
      <Cell title="这是一个单元格" />
    </div>
  );
};
```

## 可用的 CSS Variables

### 主色调
- `--nutui-color-primary`: 主色调
- `--nutui-color-primary-pressed`: 主色调按下状态
- `--nutui-color-primary-disabled`: 主色调禁用状态
- `--nutui-color-primary-light`: 主色调浅色
- `--nutui-color-primary-icon`: 主色调图标颜色

### 功能色
- `--nutui-color-success`: 成功色
- `--nutui-color-warning`: 警告色
- `--nutui-color-danger`: 危险色
- `--nutui-color-info`: 信息色

### 中性色
- `--nutui-color-text`: 文本色
- `--nutui-color-text-help`: 辅助文本色
- `--nutui-color-text-disabled`: 禁用文本色
- `--nutui-color-title`: 标题色
- `--nutui-color-title2`: 副标题色

### 背景色
- `--nutui-color-background`: 背景色
- `--nutui-color-background-overlay`: 覆盖层背景色
- `--nutui-color-background-sunken`: 下沉背景色

### 边框色
- `--nutui-color-border`: 边框色
- `--nutui-color-border-disabled`: 禁用边框色

### 字体
- `--nutui-font-family`: 字体族
- `--nutui-font-size-base`: 基础字体大小
- `--nutui-font-size-s`: 小字体大小
- `--nutui-font-size-l`: 大字体大小
- `--nutui-font-size-xl`: 超大字体大小

### 间距
- `--nutui-spacing-base`: 基础间距
- `--nutui-spacing-xs`: 小间距
- `--nutui-spacing-xl`: 大间距

### 圆角
- `--nutui-radius-s`: 小圆角
- `--nutui-radius-base`: 基础圆角
- `--nutui-radius-l`: 大圆角
- `--nutui-radius-circle`: 圆形圆角

## 暗色主题

暗色主题通过 `[data-theme='dark']` 选择器来定义：

```css
[data-theme='dark'] {
  --nutui-color-primary: #1677ff;
  --nutui-color-background: #1a1a1a;
  --nutui-color-text: #e0e0e0;
  /* 其他暗色主题变量... */
}
```

## 最佳实践

### 1. 变量命名规范
- 使用 `--nutui-` 前缀
- 使用 kebab-case 命名方式
- 语义化命名

### 2. 主题切换
- 使用 `data-theme` 属性来切换主题
- 提供平滑的过渡动画
- 保存用户的主题偏好

### 3. 性能优化
- 避免频繁修改 CSS Variables
- 使用 `requestAnimationFrame` 进行批量更新
- 合理使用 CSS 缓存

### 4. 兼容性
- 确保 CSS Variables 的浏览器兼容性
- 提供降级方案
- 测试不同设备和浏览器

## 示例项目

查看 `src/components/ThemeDemo.tsx` 组件，了解完整的使用示例。

## 注意事项

1. **CSS Variables 优先级**：CSS Variables 的优先级高于 SCSS 变量
2. **浏览器兼容性**：确保目标浏览器支持 CSS Variables
3. **性能考虑**：避免在关键路径中频繁修改 CSS Variables
4. **主题一致性**：确保所有组件都使用相同的主题变量

## 故障排除

### 常见问题

1. **主题不生效**
   - 检查 CSS Variables 是否正确定义
   - 确认文件引入顺序
   - 验证变量名是否正确

2. **暗色主题切换失败**
   - 检查 `data-theme` 属性是否正确设置
   - 确认暗色主题变量是否完整定义

3. **样式冲突**
   - 检查 CSS 优先级
   - 确认没有其他样式覆盖

### 调试技巧

1. 使用浏览器开发者工具检查 CSS Variables
2. 使用 `getComputedStyle` 获取计算后的样式
3. 检查元素是否正确应用了主题变量

## 参考资源

- [NutUI-React 3.0 官方文档](https://nutui.jd.com/taro/react/3x/)
- [CSS Variables 规范](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Variables 浏览器兼容性](https://caniuse.com/css-variables) 
