// app/components/icons/CalendarIcon.tsx
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color?: string };

export const CalendarIcon = ({ size = 26, color = "#fff" }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
    {/* add more paths for details */}
  </Svg>
);
export default CalendarIcon;
