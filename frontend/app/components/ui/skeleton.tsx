import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  animated = true,
}) => {
  const baseClasses = 'bg-gray-200';
  const roundedClasses = rounded ? 'rounded' : '';
  const animatedClasses = animated ? 'animate-pulse' : '';
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${roundedClasses} ${animatedClasses} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        rounded
        className={i === lines - 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height={24} rounded className="w-1/2" />
      <Skeleton height={48} rounded className="w-1/3" />
      <SkeletonText lines={3} />
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height={24} rounded className="w-1/3" />
      <div className="flex items-end justify-between h-32 space-x-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            height={`${Math.random() * 60 + 20}%`}
            width="12%"
            rounded
          />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="p-6">
      <Skeleton height={24} rounded className="w-1/3 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                height={20}
                rounded
                className={colIndex === 0 ? 'w-1/4' : 'w-1/6'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonPieChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height={24} rounded className="w-1/2" />
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
          <Skeleton height={16} rounded className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton height={12} width={12} rounded />
            <Skeleton height={16} rounded className="w-1/3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height={20} rounded className="w-2/3" />
      <Skeleton height={48} rounded className="w-1/2" />
      <div className="flex items-center space-x-2">
        <Skeleton height={16} width={16} rounded />
        <Skeleton height={16} rounded className="w-1/4" />
      </div>
    </div>
  </div>
);
