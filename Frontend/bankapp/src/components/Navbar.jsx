import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../store/actions/authActions'; 



function NavbarComponent() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className={styles.navbarCustom}>
      <Container>
        <Link to="/" className={styles.navbarBrand}>Simon's bank</Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.navbarNav}>
            <NavLink
              to="/wallet"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Wallet
            </NavLink>
            <NavLink
              to="/deposit"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Deposit
            </NavLink>
            <NavLink
              to="/transfer"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Transfer
            </NavLink>
            <NavLink
              to="/transaction"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Transactions
            </NavLink>
          </Nav>
          <Navbar.Text className={`${styles.navbarLogInText} ms-auto`}>
            {isAuthenticated && user ? (
              <>
                Signed in as:
                <Link to="/profile" className={styles.authLink}>
                  {user.name}
                </Link>
                <Link onClick={handleLogout} className={`${styles.authLink} ${styles.logoutButton} ms-2`}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`${styles.authLink} me-2`}>Login</Link>
                <Link to="/register" className={styles.authLink}>Register</Link>
              </>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;