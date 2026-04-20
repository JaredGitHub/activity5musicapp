'use client'
import Link from 'next/link';
import { useSession } from "next-auth/react";



const NavBar = () => {
const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <span className='navbar-brand'>Jared's Music</span>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNavAltMarkup'
        aria-controls='navbar-navAltMarkup'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbar-navAltMarkup'>
        <div className='navbar-nav'>
          <span className='nav-item nav-link'>
            <Link href='/'>Albums</Link>
          </span>
          <span className='nav-item nav-link'>
            <Link href='/playlists'>Playlists</Link>
          </span>
          <span className='nav-item nav-link'>
            <Link href='/about'>About</Link>
          </span>
          {/* --- NextAuth Links (Add These) --- */}
          {!isLoggedIn && <Link href="/api/auth/signin" className="nav-item nav-link">
            Sign In
          </Link>}

          <Link href="/api/auth/signout" className="nav-item nav-link">
            Sign Out
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
