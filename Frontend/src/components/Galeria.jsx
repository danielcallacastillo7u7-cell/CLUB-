import './Galeria.css'

const fotos = [
    {
        url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
        titulo: 'Piscina'
    },
    {
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600',
        titulo: 'Área de descanso'
    },
    {
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600',
        titulo: 'Zona de toldos'
    },
    {
        url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600',
        titulo: 'Bar'
    },
    {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        titulo: 'Área de juegos'
    },
    {
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
        titulo: 'Departamentos'
    },
    ]

    function Galeria() {
    return (
        <section className="galeria" id="galeria">
        <div className="galeria-contenido">
            <h2>Nuestra Galería</h2>
            <p className="galeria-subtitulo">Conoce nuestras instalaciones</p>

            <div className="galeria-grid">
            {fotos.map((foto, index) => (
                <div className="galeria-item" key={index}>
                <img src={foto.url} alt={foto.titulo} />
                <div className="galeria-overlay">
                    <span>{foto.titulo}</span>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    )
}

export default Galeria