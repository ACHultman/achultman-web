import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import GamePageLayout from '@components/Games/GamePageLayout';

const HowMuchIsABillion = dynamic(
  () => import('@components/Games/HowMuchIsABillion'),
  { ssr: false }
);

export default function HowMuchIsABillionPage() {
  return (
    <>
      <NextSeo
        title="How Much Is A Billion?"
        description="Scroll from $1 to $1 trillion. Watch scale break your brain. Try to buy a house in Vancouver."
        canonical="https://hultman.dev/games/how-much-is-a-billion"
      />
      <GamePageLayout title="How Much Is A Billion?" emoji="💰">
        <HowMuchIsABillion />
      </GamePageLayout>
    </>
  );
}
