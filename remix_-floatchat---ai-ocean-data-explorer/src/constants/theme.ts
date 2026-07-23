export const THEME = {
  colors: {
    primary: '#031B2E',
    secondary: '#06283D',
    accent: '#00B4FF',
    highlight: '#5EE6FF',
    text: '#FFFFFF',
    muted: '#A8C7D8',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(94, 230, 255, 0.15)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',
    cardBg: 'rgba(6, 40, 61, 0.6)',
  },
  fonts: {
    heading: 'Space Grotesk, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  gradients: {
    heroHeading: 'linear-gradient(180deg, #FFFFFF 20%, #A8C7D8 60%, #38BDF8 100%)',
    oceanText: 'linear-gradient(135deg, #FFFFFF 0%, #5EE6FF 50%, #00B4FF 100%)',
    button: 'linear-gradient(135deg, #00B4FF 0%, #0077C8 100%)',
    buttonHover: 'linear-gradient(135deg, #5EE6FF 0%, #00B4FF 100%)',
    oceanGlow: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 255, 0.15) 0%, rgba(3, 27, 46, 0) 70%)',
  },
} as const;
