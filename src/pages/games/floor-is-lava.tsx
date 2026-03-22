import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const FloorIsLava = dynamic(
  () => import('@components/Games/FloorIsLava'),
  { ssr: false }
);

export default function FloorIsLavaPage() {
  return (
    <>
      <NextSeo
        title="Floor is Lava (Literally)"
        description="Flip gravity. Collect coins. Dodge spikes. Every 5 levels the rules mutate and stack. Good luck."
        canonical="https://hultman.dev/games/floor-is-lava"
      />
      <GamePageLayout title="Floor is Lava (Literally)" emoji="🌋">
        <FloorIsLava />
      </GamePageLayout>
    </>
  );
}
