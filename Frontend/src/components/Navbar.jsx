import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <nav className="navbar">
            <div className="navbar-wrapper">
                <div className="navbar-logo">
                    <Link to="/login" onClick={cerrarMenu}>Club Catarindo</Link>                </div>

                {/* La hamburguesa ahora está aquí para que en móvil quede a la derecha */}
                <div className={`hamburguesa ${menuAbierto ? 'open' : ''}`} onClick={() => setMenuAbierto(!menuAbierto)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`navbar-links ${menuAbierto ? 'activo' : ''}`}>
                    <li><Link to="/" onClick={cerrarMenu}>Inicio</Link></li>
                    <li><a href="#servicios" onClick={cerrarMenu}>Servicios</a></li>
                    <li><a href="#galeria" onClick={cerrarMenu}>Galería</a></li>
                    <li><a href="#contacto" onClick={cerrarMenu}>Contacto</a></li>
                    {/* Este botón SOLO se verá cuando el menú móvil esté abierto */}
                    <li className="nav-item-mobile">
                        <Link to="/login" className="btn-login" onClick={cerrarMenu}>Iniciar Sesión</Link>
                    </li>
                </ul>

                {/* Este botón SOLO se verá en computadoras (escritorio) */}
                <div className="navbar-desktop-action">
                    <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;