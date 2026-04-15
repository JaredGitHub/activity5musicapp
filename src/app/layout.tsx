import type { Metadata } from 'next';
import NavBar from '../NavBar';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SessionWrapper from './SessionWrapper';

export const metadata: Metadata = {
  title: 'My Music',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <SessionWrapper>
          <NavBar />
          {children}
        </SessionWrapper>

      </body>
    </html>
  );
}
