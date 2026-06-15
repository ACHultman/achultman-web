import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const EscalatorGame = dynamic(
  () => import('@components/Games/Escalator/index'),
  { ssr: false }
);

export default function EscalatorPage() {
  return (
    <>
      <NextSeo
        title="The Escalator"
        description="A mundane scenario. Three choices. Hidden personality axes. Five rounds of escalating absurdity ending in a fake newspaper headline about you."
        openGraph={{
          title: 'Adam Hultman | The Escalator',
          description:
            'Five rounds of escalating absurdity. Hidden personality tracking. Ends in a newspaper headline.',
          url: 'https://hultman.dev/games/escalator',
        }}
        canonical="https://hultman.dev/games/escalator"
      />
      <GamePageLayout title="The Escalator" emoji="🎭">
        <EscalatorGame />
      </GamePageLayout>
    </>
  );
}
