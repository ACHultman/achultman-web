import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const WhatCouldGoWrong = dynamic(
  () => import('@components/Games/WhatCouldGoWrong'),
  { ssr: false }
);

export default function WhatCouldGoWrongPage() {
  return (
    <>
      <NextSeo
        title="What Could Go Wrong"
        description="A pristine office. Everything is a physics object. There is no objective. The whiteboard is already disappointed in you."
        canonical="https://hultman.dev/games/what-could-go-wrong"
      />
      <GamePageLayout title="What Could Go Wrong" emoji="🏢" fullWidth>
        <WhatCouldGoWrong />
      </GamePageLayout>
    </>
  );
}
