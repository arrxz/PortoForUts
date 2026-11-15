import React from 'react';
import { SplitText } from '../components/reactbits/SplitText';
import { SpotlightCard } from '../components/reactbits/SpotlightCard';
import { MagnetButton } from '../components/reactbits/MagnetButton';
import { CopyEmailButton } from '../components/reactbits/CopyEmailButton';

export const registry: Record<string, React.ComponentType<any>> = {
  SplitText,
  SplitHeading: SplitText,
  SpotlightCard,
  MagnetButton,
  CopyEmailButton,
};
