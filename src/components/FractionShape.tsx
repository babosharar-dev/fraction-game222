import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FractionShapeProps {
  numerator: number;
  denominator: number;
  type?: 'circle' | 'square';
  size?: number;
  interactive?: boolean;
  onSliceClick?: (index: number) => void;
  selectedSlices?: number[];
}

export const FractionShape: React.FC<FractionShapeProps> = ({
  numerator,
  denominator,
  type = 'circle',
  size = 200,
  interactive = false,
  onSliceClick,
  selectedSlices = [],
}) => {
  const renderCircle = () => {
    const center = size / 2;
    const radius = size * 0.45;
    const slices = [];

    for (let i = 0; i < denominator; i++) {
      const startAngle = (i * 360) / denominator;
      const endAngle = ((i + 1) * 360) / denominator;
      
      const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
      const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
      const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
      const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

      const largeArcFlag = 360 / denominator > 180 ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = interactive ? selectedSlices.includes(i) : i < numerator;

      slices.push(
        <motion.path
          key={i}
          d={pathData}
          fill={isFilled ? '#88B04B' : '#FAEDCD'}
          stroke="#4A443F"
          strokeWidth="2"
          whileHover={interactive ? { scale: 1.05, fill: isFilled ? '#6B8E36' : '#E0D7C6' } : {}}
          onClick={() => interactive && onSliceClick?.(i)}
          className={interactive ? 'cursor-pointer' : ''}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#4A443F"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      </svg>
    );
  };

  const renderSquare = () => {
    const slices = [];
    const sliceWidth = size / denominator;

    for (let i = 0; i < denominator; i++) {
        const isFilled = interactive ? selectedSlices.includes(i) : i < numerator;
        slices.push(
            <motion.rect
                key={i}
                x={i * sliceWidth}
                y={0}
                width={sliceWidth}
                height={size}
                fill={isFilled ? '#FFD93D' : '#FAEDCD'}
                stroke="#4A443F"
                strokeWidth="2"
                whileHover={interactive ? { scaleY: 1.05, fill: isFilled ? '#f59e0b' : '#E0D7C6' } : {}}
                onClick={() => interactive && onSliceClick?.(i)}
                className={interactive ? 'cursor-pointer' : ''}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
            />
        );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices}
        <motion.rect
            x={2}
            y={2}
            width={size - 4}
            height={size - 4}
            fill="none"
            stroke="#4A443F"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
        />
      </svg>
    );
  };

  return (
    <div className="flex items-center justify-center p-4">
      {type === 'circle' ? renderCircle() : renderSquare()}
    </div>
  );
};
