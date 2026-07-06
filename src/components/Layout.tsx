import BottomNav from './BottomNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <main className="content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
