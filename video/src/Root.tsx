import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { Thumb } from './Thumbnail';
import { TOTAL } from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* The YouTube cut. 1920 x 1080, 30 fps. */}
    <Composition id="Film" component={Film} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    {/* Its YouTube thumbnail. */}
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
