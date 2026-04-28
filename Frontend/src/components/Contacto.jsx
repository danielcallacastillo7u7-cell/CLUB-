import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import './Contacto.css';

function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '', 
        email: '', 
        asunto: '', 
        mensaje: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'enviando', 'exito'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('enviando');

        try {
            // CONEXIÓN REAL AL BACKEND
            const response = await fetch('http://localhost:3000/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('exito');
                // Resetear formulario tras 3 segundos de mostrar éxito
                setTimeout(() => {
                    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
                    setStatus('idle');
                }, 3000);
            } else {
                // Si el servidor responde con un error (ej. 500)
                console.error("Error del servidor:", data.error);
                alert("Error al enviar: " + (data.error || "Inténtalo de nuevo"));
                setStatus('idle');
            }
        } catch (error) {
            // Error de red o servidor apagado
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
            setStatus('idle');
        }
    };

    return (
        <section className="contacto" id="contacto">
            <div className="contacto-contenido">
                
                {/* Bloque de Información Izquierda */}
                <div className="contacto-info">
                    <span className="contacto-tag">Canales de Atención</span>
                    <h2>Ponte en contacto <span>con Catarindo</span></h2>
                    <p className="contacto-descripcion">
                        ¿Tienes dudas sobre los departamentos o las áreas comunes? 
                        Nuestro equipo está disponible los 7 días de la semana para brindarte una atención personalizada.
                    </p>

                    <div className="contacto-grid">
                        <div className="contacto-dato">
                            <div className="icon-wrapper">
                                <span className="icon-box"><MapPin size={22} /></span>
                            </div>
                            <div className="dato-texto">
                                <h4>Ubicación</h4>
                                <p>Mollendo, Arequipa - Perú</p>
                            </div>
                        </div>

                        <div className="contacto-dato">
                            <div className="icon-wrapper">
                                <span className="icon-box"><Phone size={22} /></span>
                            </div>
                            <div className="dato-texto">
                                <h4>Teléfono Directo</h4>
                                <p>+51 999 999 999</p>
                            </div>
                        </div>

                        <div className="contacto-dato">
                            <div className="icon-wrapper">
                                <span className="icon-box"><Mail size={22} /></span>
                            </div>
                            <div className="dato-texto">
                                <h4>Consultas Online</h4>
                                <p>contacto@clubcatarindo.com</p>
                            </div>
                        </div>

                        <div className="contacto-dato">
                            <div className="icon-wrapper">
                                <span className="icon-box"><Clock size={22} /></span>
                            </div>
                            <div className="dato-texto">
                                <h4>Horario Administrativo</h4>
                                <p>Lun - Dom: 8am - 8pm</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloque de Formulario Derecha */}
                <div className="contacto-form-container">
                    <div className="contacto-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-grupo">
                                    <label htmlFor="nombre">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        id="nombre"
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleChange} 
                                        placeholder="Escribe tu nombre" 
                                        required 
                                    />
                                </div>
                                <div className="form-grupo">
                                    <label htmlFor="email">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="ejemplo@correo.com" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="asunto">Asunto de la consulta</label>
                                <input 
                                    type="text" 
                                    id="asunto"
                                    name="asunto" 
                                    value={formData.asunto} 
                                    onChange={handleChange} 
                                    placeholder="¿En qué podemos ayudarte?" 
                                    required 
                                />
                            </div>

                            <div className="form-grupo">
                                <label htmlFor="mensaje">Mensaje o Detalles</label>
                                <textarea 
                                    id="mensaje"
                                    name="mensaje" 
                                    value={formData.mensaje} 
                                    onChange={handleChange} 
                                    placeholder="Cuéntanos más detalles sobre tu consulta..." 
                                    rows={5} 
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className={`btn-enviar ${status !== 'idle' ? 'active' : ''}`} 
                                disabled={status !== 'idle'}
                            >
                                {status === 'idle' && (
                                    <>Enviar Mensaje <Send size={18} /></>
                                )}
                                {status === 'enviando' && (
                                    <>Procesando... <div className="spinner"></div></>
                                )}
                                {status === 'exito' && (
                                    <>¡Enviado con éxito! <CheckCircle size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contacto;