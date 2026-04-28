import { createContext, useState, useContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    // usuario tendrá: { id, nombre, correo, rol: 'socio' | 'admin', token }

    const login = (datos) => {
        setUsuario(datos)
        localStorage.setItem('usuario', JSON.stringify(datos))
    }

    const logout = () => {
        setUsuario(null)
        localStorage.removeItem('usuario')
    }

    const cargarSesion = () => {
        const guardado = localStorage.getItem('usuario')
        if (guardado) {
        setUsuario(JSON.parse(guardado))
        }
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargarSesion }}>
        {children}
        </AuthContext.Provider>
    )
    }

    // eslint-disable-next-line react-refresh/only-export-components
    export function useAuth() {
    return useContext(AuthContext)
}