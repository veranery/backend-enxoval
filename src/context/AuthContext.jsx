import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const DEFAULT_LAYETTE_ITEMS = [
  // ROUPINHAS (#FF6B6B)
  { id: 1, name: 'Body Manga Curta RN', category: 'ROUPINHAS', recommendedQuantity: 5 },
  { id: 2, name: 'Body Regata RN', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 3, name: 'Body Manga longa RN', category: 'ROUPINHAS', recommendedQuantity: 4 },
  { id: 4, name: 'Body Manga Curta P', category: 'ROUPINHAS', recommendedQuantity: 6 },
  { id: 84, name: 'Body Manga Longa P', category: 'ROUPINHAS', recommendedQuantity: 4 },
  { id: 5, name: 'Body Regata P', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 6, name: 'Body Manga Curta M', category: 'ROUPINHAS', recommendedQuantity: 6 },
  { id: 7, name: 'Regata RN', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 8, name: 'Regata P', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 9, name: 'Regata M', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 10, name: 'Mijão RN', category: 'ROUPINHAS', recommendedQuantity: 6 },
  { id: 11, name: 'Mijão P', category: 'ROUPINHAS', recommendedQuantity: 6 },
  { id: 85, name: 'Mijão M', category: 'ROUPINHAS', recommendedQuantity: 6},
  { id: 12, name: 'Macacão Longo RN', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 13, name: 'Macacão Longo P', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 14, name: 'Macacão Curto ou Vestidos P', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 15, name: 'Macacão Curto ou Vestidos M', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 16, name: 'Pares de meia RN', category: 'ROUPINHAS', recommendedQuantity: 6 },
  { id: 17, name: 'Shorts (tapa fralda) P', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 18, name: 'Shorts (tapa fralda) M', category: 'ROUPINHAS', recommendedQuantity: 3 },
  { id: 19, name: 'Saídas Maternidade', category: 'ROUPINHAS', recommendedQuantity: 2 },
  { id: 20, name: 'Troca Maternidade', category: 'ROUPINHAS', recommendedQuantity: 1 },
  { id: 21, name: 'Kit de Touca, Luva e Sapato', category: 'ROUPINHAS', recommendedQuantity: 2 },

  // ENXOVAL (#FFA500)
  { id: 22, name: 'Fraldas', category: 'ENXOVAL', recommendedQuantity: 10 },
  { id: 23, name: 'Panos de Boca', category: 'ENXOVAL', recommendedQuantity: 10 },
  { id: 24, name: 'Cueiros', category: 'ENXOVAL', recommendedQuantity: 8 },
  { id: 25, name: 'Tolha Soft (para banho)', category: 'ENXOVAL', recommendedQuantity: 3 },
  { id: 26, name: 'Cobertor', category: 'ENXOVAL', recommendedQuantity: 2 },
  { id: 27, name: 'Mantas', category: 'ENXOVAL', recommendedQuantity: 2 },
  { id: 28, name: 'Saco de Dormir', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 29, name: 'Almofada Amamentação', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 30, name: 'Trocador', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 31, name: 'Trocador Portátil', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 32, name: 'Ninho Redutor', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 33, name: 'Travesseiro Antirefluxo', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 34, name: 'Mala Maternidade', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 35, name: 'Mochila Maternidade', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 36, name: 'Kit Saquinho Maternidade', category: 'ENXOVAL', recommendedQuantity: 1 },
  { id: 37, name: 'Canguru ou sling (livre)', category: 'ENXOVAL', recommendedQuantity: 1 },

  // HIGIENE (#FFD93D)
  { id: 38, name: 'Pct de Fralda Descartáveis RN', category: 'HIGIENE', recommendedQuantity: 3 },
  { id: 39, name: 'Colônia', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 40, name: 'Banheira', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 41, name: 'Balde de roupa suja', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 42, name: 'Balde (ofurô)', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 43, name: 'Lixeira', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 44, name: 'Hidrante corporal', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 45, name: 'Sabonete líquido', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 46, name: 'Absorvente para seio', category: 'HIGIENE', recommendedQuantity: 1 },
  { id: 47, name: 'Lenço Umidecido (Pct com 100 unds)', category: 'HIGIENE', recommendedQuantity: 2},
  { id: 73, name: 'Termômetro', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 74, name: 'Aspirador Nasal', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 75, name: 'Bolsa térmica para cólica', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 76, name: 'Kit unha', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 77, name: 'Kit escova e pente', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 78, name: 'Escova de dentes para massagear', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 79, name: 'Repelente em creme', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 80, name: 'Cotonete', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 81, name: 'Algodão', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 82, name: 'Álcool 70 em gel', category: 'HIGIENE', recommendedQuantity: 1},
  { id: 83, name: 'Pomada de assadura', category: 'HIGIENE', recommendedQuantity: 2},


  // ACESSÓRIO (#6BCB77)
  { id: 48, name: 'Mamadeira (livre)', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 49, name: 'Escova para limpar mamadeira (livre)', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 50, name: 'Chupeta (livre)', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 51, name: 'Prendendor de chupeta (livre)', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 52, name: 'Bomba de tirar leite', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 53, name: 'Mordedor', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 54, name: 'Trava para gaveta', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 55, name: 'Protetor de quina', category: 'ACESSÓRIO', recommendedQuantity: 1 },
  { id: 56, name: 'Tapete de atividades', category: 'ACESSÓRIO', recommendedQuantity: 1 },

  // MALA DA MATERNIDADE (#4D96FF)
  { id: 57, name: 'Saída maternidade', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 58, name: 'Manta', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 59, name: 'Toalha de banho', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 60, name: 'Fralda', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 61, name: 'Panos de boca', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 62, name: 'Luvinha', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 63, name: 'Meia', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 64, name: 'Touca', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 65, name: 'Fralda descartável RN', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 66, name: 'Roupinhas extra', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },
  { id: 67, name: 'Itens de higiene que depende da maternidade', category: 'MALA DA MATERNIDADE', recommendedQuantity: 3 },

  // QUARTO (#9D4EDD) (Was BERÇO)
  { id: 68, name: 'Berço (Dê preferência aos que vira cama ou mini sofá)', category: 'QUARTO', recommendedQuantity: 1 },
  { id: 69, name: 'Kit berço (com mosquiteiro)', category: 'QUARTO', recommendedQuantity: 1 },
  { id: 70, name: 'Cômodas (livre)', category: 'QUARTO', recommendedQuantity: 1 },
  { id: 71, name: 'Guarda roupa (livre)', category: 'QUARTO', recommendedQuantity: 1 },
  { id: 72, name: 'Cama Auxiliar (livre)', category:'QUARTO', recommendedQuantity:1 },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [layetteItems, setLayetteItems] = useState([]);

  useEffect(() => {
    const storedPhone = localStorage.getItem('currentUser');
    if (storedPhone) {
      setCurrentUser(storedPhone);
      loadUserData(storedPhone);
    }
  }, []);

  const loadUserData = (phone) => {
    const userData = localStorage.getItem(`userData_${phone}`);
    if (userData) {
      let parsedData = JSON.parse(userData);
      
      // Migration Logic
      const needsMigration = parsedData.some(item => 
        item.category === 'BERÇO' || 
        (item.id === 38 && item.category !== 'HIGIENE') ||
        item.category === 'Roupas' ||
        (item.category === 'MALA DA MATERNIDADE' && item.recommendedQuantity !== 3) ||
        (item.id === 67 && !item.name.includes('mini sofá'))
      );

      if (needsMigration) {
        // If it's the very old 'Roupas' schema, just reset because IDs might not match
        if (parsedData.some(item => item.category === 'Roupas')) {
          initializeDefaultData(phone);
          return;
        }

        // Migrate existing items
        const migratedData = parsedData.map(item => {
          let newItem = { ...item };
          
          if (newItem.category === 'BERÇO') {
            newItem.category = 'QUARTO';
          }
          if (newItem.id === 38 && newItem.category !== 'HIGIENE') {
            newItem.category = 'HIGIENE';
          }
          if (newItem.category === 'MALA DA MATERNIDADE') {
            newItem.recommendedQuantity = 3;
          }
          if (newItem.id === 67) {
            newItem.name = 'Berço (Dê preferência aos que viram cama ou mini sofá)';
          }
          
          return newItem;
        });
        
        setLayetteItems(migratedData);
        localStorage.setItem(`userData_${phone}`, JSON.stringify(migratedData));
      } else {
        setLayetteItems(parsedData);
      }
    } else {
      initializeDefaultData(phone);
    }
  };

  const initializeDefaultData = (phone) => {
    const defaultItems = DEFAULT_LAYETTE_ITEMS.map(item => ({
      ...item,
      desiredQuantity: item.recommendedQuantity,
      purchased: false,
    }));
    setLayetteItems(defaultItems);
    localStorage.setItem(`userData_${phone}`, JSON.stringify(defaultItems));
  };

  const login = (phone) => {
    setCurrentUser(phone);
    localStorage.setItem('currentUser', phone);
    loadUserData(phone);
  };

  const logout = () => {
    setCurrentUser(null);
    setLayetteItems([]);
    localStorage.removeItem('currentUser');
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    const updatedItems = layetteItems.map(item =>
      item.id === itemId ? { ...item, desiredQuantity: newQuantity } : item
    );
    setLayetteItems(updatedItems);
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(updatedItems));
  };

  const toggleItemPurchased = (itemId) => {
    const updatedItems = layetteItems.map(item =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    );
    setLayetteItems(updatedItems);
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(updatedItems));
  };

  const resetList = () => {
    initializeDefaultData(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        layetteItems,
        login,
        logout,
        updateItemQuantity,
        toggleItemPurchased,
        resetList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};