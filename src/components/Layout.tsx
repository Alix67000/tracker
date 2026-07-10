import { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 px-5 pt-3 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
