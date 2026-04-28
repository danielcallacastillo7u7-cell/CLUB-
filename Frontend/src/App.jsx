import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel'; 
import Dashboard from './pages/Dashboard/index';
import RecuperarContrasena from './pages/RecuperarContrasena';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * 1. PROTECTED ROUTE
 * Solo deja pasar si hay un usuario logueado. 
 * Si 'adminOnly' es true, además verifica que el rol sea 'admin'.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div className="loading">Cargando sesión...</div>;
  
  if (!usuario) return <Navigate to="/login" replace />;

  if (adminOnly && usuario.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * 2. PUBLIC ROUTE
 * Si el usuario ya está logueado, lo saca del Login y lo envía a su sitio.
 */
const PublicRoute = ({ children }) => {
  const { usuario } = useAuth();

  if (usuario) {
    return usuario.rol === 'admin' 
      ? <Navigate to="/panel-admin" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  
  // Lista de rutas donde ocultamos el Navbar (Dashboard, Paneles, Logins)
  const ocultarNavbar = [
    '/login', 
    '/dashboard', 
    '/recuperar', 
    '/admin-login', 
    '/panel-admin'
  ].includes(location.pathname);

  return (
    <>
      {!ocultarNavbar && <Navbar />}
      <Routes>
        {/* --- RUTAS INICIALES --- */}
        <Route path="/" element={<Inicio />} />

        {/* --- RUTAS PÚBLICAS (Se bloquean si ya iniciaste sesión) --- */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/recuperar" element={<PublicRoute><RecuperarContrasena /></PublicRoute>} />

        {/* --- RUTAS PRIVADAS PARA ADMINISTRADORES --- */}
        <Route 
          path="/panel-admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        {/* --- RUTAS PRIVADAS PARA SOCIOS --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección por si escriben cualquier otra cosa */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;