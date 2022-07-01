import {
  fontWeight,
  desktopFontSize,
  desktopLineHeight,
  mobileFontSize,
  mobileLineHeight,
  boxShadow,
  spacing,
  customTheme
} from 'pds-dev-kit-web';

import { DefaultTheme } from 'styled-components';

export const fontSize = {
  displayHeading: '32px',
  heading: '24px',
  leadParagraph: '20px',
  subtitle: '18px',
  body1: '18px',
  body2: '16px',
  caption1: '14px',
  caption2: '12px',
  form1: '16px',
  form2: '14px',
  blog1: '16px'
};

export const fontLineHeight = {
  fontLineHeight: '1.5em'
};

export const margins = {
  marginSideNormal: '0 24px'
};

// NOTE: fontSizeM은 UM의 컴포넌트를 가져오며 잠시 넣어둔 부분. 추후 정리 필요
export const fontSizeM = {
  fontSizeH1: '32px',
  fontSizeH2: '24px',
  fontSizeSubtitle: '18px',
  fontSizeBody1: '18px',
  fontSizeBody2: '16px',
  fontSizeCaption1: '14px',
  fontSizeCaption2: '12px',
  fontSizeForm1: '16px',
  fontSizeForm2: '14px',
  fontSizeBlog1: '16px'
};

declare global {
  interface Window {
    PublUtils: any;
  }
}

const theme: DefaultTheme = {
  ...fontSize,
  ...fontSizeM,
  ...fontLineHeight,
  ...fontWeight,
  ...margins,
  ...customTheme(
    window.PublUtils ? window.PublUtils.ChannelEnv.custom.experimentals.tone : 'DARK',
    window?.PublUtils?.ChannelEnv?.custom?.experimentals?.paletteOverride
  ),
  fontWeight,
  desktopFontSize,
  desktopLineHeight,
  mobileFontSize,
  mobileLineHeight,
  boxShadow,
  spacing
};

export default theme;
