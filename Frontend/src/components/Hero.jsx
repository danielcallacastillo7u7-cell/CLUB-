import React from 'react';
import './Hero.css';

function Hero() {
    return (
        <section className="hero" id="inicio">
            <div className="hero-overlay">
                <div className="hero-contenido">
                    <h1>Bienvenido a <br /><span>Club Catarindo</span></h1>
                    <p>
                        Tu espacio exclusivo de descanso y recreación en el corazón de Mollendo. 
                        Disfruta de instalaciones de primer nivel diseñadas para tu bienestar.
                    </p>
                    <div className="hero-botones">
                        <a href="#servicios" className="btn-primario">
                            Ver Servicios
                        </a>
                        <a href="#contacto" className="btn-secundario">
                            Contáctanos
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Elemento decorativo opcional: indicador de scroll */}
            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
            </div>
        </section>
    );
}

export default Hero;