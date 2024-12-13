// 检查是否是有效的 SVG
export const isValidSvg = (str: string): boolean => {
  return str.trim().startsWith('<svg') && str.includes('</svg>');
};

// 检查是否是 SVG URL
export const isSvgUrl = (str: string): boolean => {
  return str.trim().toLowerCase().endsWith('.svg');
};

// 检查是否是 Emoji
export const isEmoji = (str: string): boolean => {
  const emojiRegex = /[\p{Emoji}]/u;
  return emojiRegex.test(str);
};

// 格式化图标
export const formatIcon = (icon: string | undefined): string => {
  if (!icon) return '';  // 如果没有图标，返回空字符串

  // 如果是 SVG 代码
  if (isValidSvg(icon)) {
    return icon;
  }

  // 如果是 SVG URL
  if (isSvgUrl(icon)) {
    return `<img src="${icon}" alt="icon" style="width: 24px; height: 24px;" />`;
  }

  // 如果是 Emoji
  if (isEmoji(icon)) {
    return icon;
  }

  return '';  // 如果都不是，返回空字符串
};

export const getDefaultIcon = (type: string): string => {
  const iconMap: { [key: string]: string } = {
    'Email': '📧',
    'Phone': '📱',
    'WeChat': '💬',
    'QQ': '💬',
    'GitHub': '💻',
    'LinkedIn': '👔',
    'Twitter': '🐦',
    'Blog': '📝',
    'Website': '🌐'
  };

  return iconMap[type] || '📌';
}; 