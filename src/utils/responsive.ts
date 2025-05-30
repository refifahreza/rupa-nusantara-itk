import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimension for design
const baseWidth = 375;
const baseHeight = 812;

export const wp = (widthPercent: number) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

export const hp = (heightPercent: number) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

export const scale = (size: number) => {
  return (width / baseWidth) * size;
};

export const verticalScale = (size: number) => {
  return (height / baseHeight) * size;
};

export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const isSmallDevice = width < 375; 