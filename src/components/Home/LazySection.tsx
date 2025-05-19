import { useEffect, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  onLoaded?: () => void;
}

export default function LazySection({ children, onLoaded }: LazySectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (onLoaded) onLoaded();
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
}
