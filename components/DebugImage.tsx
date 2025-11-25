
import React, { useEffect } from 'react';

interface DebugImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const DebugImage: React.FC<DebugImageProps> = (props) => {
  const { src, alt } = props;

  useEffect(() => {
    if (src) {
      console.log(`[DEBUG_IMAGE] Component attempting to load src: ${src}`);
    } else {
      console.warn(`[DEBUG_IMAGE] Component received empty src for alt: ${alt}`);
    }
  }, [src, alt]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`[DEBUG_IMAGE] SUCCESS: Image loaded successfully for src: ${src}`);
    if (props.onLoad) props.onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`[DEBUG_IMAGE] FAILED: Image failed to load for src: ${src}. This is likely a Cross-Origin (CORS) issue.`);
    if (props.onError) props.onError(e);
  };

  return <img {...props} alt={alt || 'Scentify product image'} onLoad={handleLoad} onError={handleError} />;
};

export default DebugImage;
