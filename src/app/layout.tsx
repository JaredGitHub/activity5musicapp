import type { Metadata } from 'next';
import NavBar from '../NavBar';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata: Metadata = {
  title: 'My Music',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
