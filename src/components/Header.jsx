import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Cloud, Smartphone, Share2, Pencil, Eye, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import logoMagia from '../assets/logo-magia-kids.png';

function Header() {
  const { currentUser, logout, isSyncEnabled, isReadOnly } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    if (!shareMenuOpen) return;
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [shareMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // mode: 'edit' (a pessoa pode marcar itens e mudar quantidades) ou
  // 'view' (a pessoa só acompanha, sem poder alterar nada).
  const buildShareLink = (mode) => {
    const url = new URL(`${window.location.origin}/`);
    url.searchParams.set('tel', currentUser);
    if (mode === 'view') url.searchParams.set('modo', 'ver');
    return url.toString();
  };

  const buildShareText = (mode) =>
    mode === 'view'
      ? 'Dá uma olhada na minha lista de enxoval! Esse link é só para acompanhar (sem poder editar) 💕'
      : 'Dá uma olhada na minha lista de enxoval! Por esse link você já entra direto e pode marcar o que for comprando 💕';

  const handleShare = async (mode) => {
    setShareMenuOpen(false);

    const shareUrl = buildShareLink(mode);
    const shareText = buildShareText(mode);

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lista de Enxoval', text: shareText, url: shareUrl });
      } catch (err) {
        // pessoa cancelou o compartilhamento, não precisa fazer nada
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: 'Link copiado!',
        description: 'Cole numa conversa (WhatsApp, por exemplo) para compartilhar sua lista.',
      });
    } catch (err) {
      toast({
        title: 'Não foi possível copiar o link',
        description: shareUrl,
        variant: 'destructive',
      });
    }
  };

  // Copia só o link (sem texto e sem abrir nenhum app de mensagens),
  // pra quem quer colar em qualquer lugar por conta própria.
  const handleCopyLink = async (e, mode) => {
    e.stopPropagation();
    const shareUrl = buildShareLink(mode);

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copiado!',
        description: 'Já pode colar onde quiser.',
      });
    } catch (err) {
      toast({
        title: 'Não foi possível copiar o link',
        description: shareUrl,
        variant: 'destructive',
      });
    }
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
            <span
              title={isSyncEnabled ? 'Sua lista está sincronizada e disponível em qualquer aparelho' : 'Sua lista está salva apenas neste aparelho'}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400"
            >
              {isSyncEnabled ? <Cloud size={15} /> : <Smartphone size={15} />}
              {isSyncEnabled ? 'Sincronizado' : 'Somente neste aparelho'}
            </span>

            <span className="text-gray-600 font-medium hidden sm:inline">
              {currentUser}
            </span>

            {isReadOnly ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200">
                <Eye size={14} />
                Modo visualização
              </span>
            ) : (
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShareMenuOpen((open) => !open)}
                  className="flex items-center gap-2 px-4 py-2 bg-rosa/10 hover:bg-rosa/20 text-rosa rounded-lg transition-all duration-300 font-medium border border-rosa/20"
                  title="Compartilhar sua lista"
                >
                  <Share2 size={20} />
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>

                {shareMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3">
                      <button
                        onClick={() => handleShare('edit')}
                        className="flex items-start gap-3 flex-1 min-w-0 text-left"
                      >
                        <Pencil size={18} className="mt-0.5 text-rosa shrink-0" />
                        <span>
                          <span className="block font-semibold text-sm text-gray-800">Link para editar</span>
                          <span className="block text-xs text-gray-400 mt-0.5">A pessoa pode marcar itens comprados e mudar quantidades</span>
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleCopyLink(e, 'edit')}
                        title="Copiar link para editar"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rosa hover:bg-rosa/10 transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <div className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 border-t border-gray-100">
                      <button
                        onClick={() => handleShare('view')}
                        className="flex items-start gap-3 flex-1 min-w-0 text-left"
                      >
                        <Eye size={18} className="mt-0.5 text-azul shrink-0" />
                        <span>
                          <span className="block font-semibold text-sm text-gray-800">Link só para visualizar</span>
                          <span className="block text-xs text-gray-400 mt-0.5">A pessoa só acompanha a lista, sem poder alterar nada</span>
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleCopyLink(e, 'view')}
                        title="Copiar link para visualizar"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-azul hover:bg-azul/10 transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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