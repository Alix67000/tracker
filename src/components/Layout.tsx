import { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <main className="content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
