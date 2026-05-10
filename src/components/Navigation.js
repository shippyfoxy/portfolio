//import Image from 'next/image'
import Link from 'next/link';

/*
					<li><h6>About</h6></li>
					<li><h6>Gallery</h6></li>
*/

function Navigation() {
  const backgroundClass = {
    backgroundImage: 'url(/i/logo.svg)',
  };

  return (
    <nav>
      <div className='box align-center-wrap grid'>
        <div className='col-5 offset-1'>
          <Link href='/' passHref>
            <i
              className='logo bg-center bg-contain bg-no-repeat display-block'
              style={backgroundClass}
            />
          </Link>
        </div>
        <div className='col-5 offset-r-1'>
          <ul className='float-r'>
            <li className='nav-btn'>
              <Link className='font-size-h6' href='/card'>
                Card
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
