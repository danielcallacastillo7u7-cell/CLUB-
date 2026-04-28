import './Servicios.css'

const servicios = [
    { icono: '🏊', titulo: 'Piscina', descripcion: 'Relájate en nuestra piscina con agua cristalina para todas las edades.' },
    { icono: '🎮', titulo: 'Zona de Juegos', descripcion: 'Diversión asegurada con mesas de billar, ping pong y áreas infantiles.' },
    { icono: '🏠', titulo: 'Departamentos', descripcion: 'Habitaciones y departamentos totalmente equipados frente al mar.' },
    { icono: '🍹', titulo: 'Bar & Resto', descripcion: 'Los mejores cócteles y snacks para disfrutar bajo el sol de Mollendo.' },
    { icono: '⛱️', titulo: 'Áreas de Descanso', descripcion: 'Toldos y poltronas exclusivas para un relax total frente a la piscina.' },
    { icono: '🍳', titulo: 'Zona de Parrillas', descripcion: 'Cocina y parrillas a tu disposición para compartir en familia.' },
]

function Servicios() {
    return (
        <section className="servicios" id="servicios">
            <div className="servicios-contenido">
                <h2>Experiencia <span style={{color: '#e2b96f'}}>Catarindo</span></h2>
                <p className="servicios-subtitulo">Instalaciones de primer nivel diseñadas para crear recuerdos inolvidables.</p>
                
                <div className="servicios-grid">
                    {servicios.map((servicio, index) => (
                        <div className="servicio-card" key={index}>
                            <div className="servicio-icono">{servicio.icono}</div>
                            <h3>{servicio.titulo}</h3>
                            <p>{servicio.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Servicios