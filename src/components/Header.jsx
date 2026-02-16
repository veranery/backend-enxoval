import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoMagia from '../assets/logo-magia-kids.png';
import imagemdois from '../assets/imagem2.png'



function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <img
            src={logoMagia}
            alt="Magia Kids"
            className="h-10 object-contain sm:h-12"
          />
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium hidden sm:inline">
              {currentUser}
            </span>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-azul/10 hover:bg-azul/20 text-azul rounded-lg transition-all duration-300 font-medium border border-azul/20"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;