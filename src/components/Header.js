import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p>Coronavirus Map</p>
        <ul>
          <li>
            <Link to="/">Global Map</Link>
          </li>
          <li>
            <Link to="/us-stats">U.S. Stats</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
