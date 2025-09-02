/**
 * NutUI-React 3.0 主题切换工具函数
 * 参考文档：https://nutui.jd.com/taro/react/3x/#/zh-CN/guide/theme-react
 */

export type ThemeType = 'light' | 'dark';

/**
 * 切换主题
 * @param theme 主题类型：'light' | 'dark'
 */
export const switchTheme = (theme: ThemeType) => {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
};

/**
 * 获取当前主题
 * @returns 当前主题类型
 */
export const getCurrentTheme = (): ThemeType => {
  const root = document.documentElement;
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
};

/**
 * 动态修改 CSS Variables
 * @param variableName CSS 变量名（不包含 --nutui- 前缀）
 * @param value 变量值
 */
export const setCSSVariable = (variableName: string, value: string) => {
  const root = document.documentElement;
  const fullVariableName = `--nutui-${variableName}`;
  root.style.setProperty(fullVariableName, value);
};

/**
 * 获取 CSS Variables 值
 * @param variableName CSS 变量名（不包含 --nutui- 前缀）
 * @returns 变量值
 */
export const getCSSVariable = (variableName: string): string => {
  const root = document.documentElement;
  const fullVariableName = `--nutui-${variableName}`;
  return getComputedStyle(root).getPropertyValue(fullVariableName).trim();
};

/**
 * 批量设置 CSS Variables
 * @param variables 变量对象
 */
export const setCSSVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([name, value]) => {
    const fullVariableName = `--nutui-${name}`;
    root.style.setProperty(fullVariableName, value);
  });
};

/**
 * 预设主题配置
 */
export const themePresets = {
  // 蓝色主题
  blue: {
    'color-primary': '#1677ff',
    'color-primary-pressed': '#0958d9',
    'color-primary-disabled': '#d9d9d9',
  },
  // 绿色主题
  green: {
    'color-primary': '#52c41a',
    'color-primary-pressed': '#389e0d',
    'color-primary-disabled': '#d9d9d9',
  },
  // 紫色主题
  purple: {
    'color-primary': '#722ed1',
    'color-primary-pressed': '#531dab',
    'color-primary-disabled': '#d9d9d9',
  },
  // 橙色主题
  orange: {
    'color-primary': '#fa8c16',
    'color-primary-pressed': '#d46b08',
    'color-primary-disabled': '#d9d9d9',
  },
};

/**
 * 应用预设主题
 * @param presetName 预设主题名称
 */
export const applyThemePreset = (presetName: keyof typeof themePresets) => {
  const preset = themePresets[presetName];
  if (preset) {
    setCSSVariables(preset);
  }
};
