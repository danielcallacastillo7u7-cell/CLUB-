import React from 'react';
import './Footer.css';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-contenido">

                {/* Sección 1: Propósito */}
                <div className="footer-seccion">
                    <div className="footer-logo">
                        <span className="brand-dot"></span>
                        <h3>Club Catarindo</h3>
                    </div>
                    <p className="footer-text-muted">
                        Comprometidos con la excelencia y la sostenibilidad en la administración de recursos para la comunidad de Mollendo.
                    </p>
                    <div className="footer-status">
                        <span className="status-indicator"></span>
                        <small>Servicio en línea 24/7</small>
                    </div>
                </div>

                {/* Sección 2: Navegación Estructural */}
                <div className="footer-seccion">
                    <h4 className="footer-subtitle">Navegación</h4>
                    <ul className="footer-links">
                        <li><a href="#inicio">Vista General</a></li>
                        <li><a href="#servicios">Nuestros Servicios</a></li>
                        <li><a href="#galeria">Reseña Visual</a></li>
                        <li><a href="/login" className="link-highlight">Acceso Residentes</a></li>
                    </ul>
                </div>

                {/* Sección 3: Datos de Gestión (No repetidos) */}
                <div className="footer-seccion">
                    <h4 className="footer-subtitle">Gestión y Transparencia</h4>
                    <div className="info-box">
                        <p><strong>RUC:</strong> 20123456789</p>
                        <p><strong>Asamblea:</strong> Último sábado/mes</p>
                        <p className="footer-tag">Sede Mollendo, Arequipa</p>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>© {year} Club Catarindo. Todos los derechos reservados.</p>
                    <div className="footer-extra-links">
                        <a href="#">Privacidad</a>
                        <span>•</span>
                        <a href="#">Estatutos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;