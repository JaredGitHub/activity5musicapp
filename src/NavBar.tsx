import Link from 'next/link';

const NavBar = () => {
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
            <Link href='/'>Main</Link>
          </span>
          <span className='nav-item nav-link'>
            <Link href='/new'>New</Link>
          </span>
          <span className='nav-item nav-link'>
            <Link href='/about'>About</Link>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
