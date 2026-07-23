import React from 'react';
import { Card, CardProps } from '../ui/Card';

export const GlassCard: React.FC<CardProps> = (props) => {
  return <Card variant="glass" {...props} />;
};
