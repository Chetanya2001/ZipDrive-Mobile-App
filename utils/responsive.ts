import { moderateScale, scale, verticalScale } from "react-native-size-matters";

// horizontal scale (width-based)
export const hs = (size: number): number => scale(size);

// vertical scale (height-based)
export const vs = (size: number): number => verticalScale(size);

// moderate scale (best for fonts)
export const ms = (size: number): number => moderateScale(size);
