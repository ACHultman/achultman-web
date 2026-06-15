import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const CatchMeGame = dynamic(
  () => import('@components/Games/CatchMe/index'),
  { ssr: false }
);

export default function CatchMePage() {
  return (
    <>
      <NextSeo
        title="Catch Me If You Can"
        description="Hunt a circle with feelings. It taunts, hides, fights back, questions existence, and eventually becomes the entire screen."
        openGraph={{
          title: 'Adam Hultman | Catch Me If You Can',
          description:
            'Hunt a circle with feelings across 5 emotional phases. A comedy circle-hunting game.',
          url: 'https://hultman.dev/games/catch-me',
        }}
        canonical="https://hultman.dev/games/catch-me"
      />
      <GamePageLayout title="Catch Me If You Can" emoji="🔴">
        <CatchMeGame />
      </GamePageLayout>
    </>
  );
}
