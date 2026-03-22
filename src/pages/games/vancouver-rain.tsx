import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const VancouverRain = dynamic(
  () => import('@components/Games/VancouverRain'),
  { ssr: false }
);

export default function VancouverRainPage() {
  return (
    <>
      <NextSeo
        title="Vancouver Rain Death Run"
        description="Walk 10 blocks home in Vancouver. It starts as drizzle. By block 9 you're platforming on floating cars."
        canonical="https://hultman.dev/games/vancouver-rain"
      />
      <GamePageLayout title="Vancouver Rain Death Run" emoji="🌧️">
        <VancouverRain />
      </GamePageLayout>
    </>
  );
}
