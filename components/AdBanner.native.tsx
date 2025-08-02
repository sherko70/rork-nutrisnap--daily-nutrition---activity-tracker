import React from 'react';

import MobileAdBanner from './MobileAdBanner';

interface AdBannerProps {
  size?: string;
}

// Native version - uses actual Google Mobile Ads
const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  return (
    <MobileAdBanner size={size} />
  );
};

export default AdBanner;