import React, { useEffect } from 'react';
import { APP_CONFIG } from '../../config/app';

export interface SEOHeadProps {
  title?: string;
  description?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = APP_CONFIG.description,
}) => {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`;

  useEffect(() => {
    document.title = fullTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [fullTitle, description]);

  return null;
};
