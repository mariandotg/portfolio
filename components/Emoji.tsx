import React from 'react';

import { Emojis } from '@/models/domain/Emojis';

import Pin from '@/public/public/pin.svg';
import Dart from '@/public/public/dart.svg';
import Business from '@/public/public/business.svg';
import Article from '@/public/public/article.svg';
import Mail from '@/public/public/mail.svg';
import Argentina from '@/public/public/argentina.svg';
import Default from '@/public/public/default.svg';

interface Props {
  emoji?: string;
  width?: number;
  height?: number;
}

const emojis: Emojis = {
  pin: Pin,
  dart: Dart,
  business: Business,
  article: Article,
  mail: Mail,
  argentina: Argentina,
  default: Default,
};

const Emoji = ({ emoji, width, height }: Props) => {
  const SelectedEmoji = emojis[emoji || 'default'];

  return <SelectedEmoji width={width} height={height} />;
};

export default Emoji;
