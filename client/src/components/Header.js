import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  // Si pas connecté → pas de navbar
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/home'); // ou "/" selon ta route d'accueil
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/ping">Banc Test Racks</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/scan">Scan</Nav.Link>
            <Nav.Link as={Link} to="/ping">Ping</Nav.Link>
            <Nav.Link as={Link} to="/seringues">Seringues</Nav.Link>
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/historique">Historique</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pingHistory">Rapport des ping</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>🔓 Déconnexion</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
