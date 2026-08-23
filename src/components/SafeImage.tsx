"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  if (/^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i.test(url)) {
    if (url.toLowerCase().includes('javascript:')) return null;
    return url;
  }
  return null;
};

export const sanitizeSrc = (src: string | undefined | null): string | null => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  if (url && url.startsWith("/partners/")) {
    url = url.replace("/partners/", "/assets/partners/");
  }
  return url;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeImage = ({ src, alt, width, height, className, onError, fill, priority, sizes, ...props }: any) => {
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const cleanSrc = sanitizeSrc(src);
  const isDataUrl = cleanSrc && cleanSrc.startsWith("data:");

  const finalSizes = fill && !sizes ? "(max-width: 768px) 48px, 64px" : sizes;

  if (isDataUrl || useFallbackImg || !cleanSrc) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img 
        src={errorCount > 0 ? "/assets/logo_sekolah/logo_smktb.png" : (cleanSrc || "/assets/logo_sekolah/logo_smktb.png")} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className} 
        onError={(e) => {
          setErrorCount(prev => prev + 1);
          if (onError) onError(e);
        }} 
        {...props} 
      />
    );
  }

  return (
    <Image 
      src={cleanSrc} 
      alt={alt} 
      width={width} 
      height={height} 
      fill={fill}
      priority={priority}
      sizes={finalSizes}
      className={className} 
      onError={(e) => {
        setUseFallbackImg(true);
        if (onError) onError(e);
      }}
      unoptimized={true}
      {...props}
    />
  );
};

export default SafeImage;
