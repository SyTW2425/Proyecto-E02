import React, { useState, useEffect } from 'react';
import '../styles/Intercambio.css';
import api from '../api';
import { useTheme } from '../context/ThemeContext';
import NavBar from './NavBar';
import Card from './Card';
import CardGallery from './CardGallery';

interface Card {
  _id: string;
  name: string;
  type: string;
  weakness: string;
  nPokeDex: number;
  hp: number;
  attacks: string[]; // Cambiado a string[] para los IDs de los ataques
  retreatCost: string[];
  phase: string;
  description?: string;
  isHolographic: boolean;
  value: number;
  rarity: string;
  image?: string;
}

interface User {
  _id: string;
  name: string;
  cards: Card[];
}

interface CardGalleryProps {
  cards: Card[];
  onCardHover?: (card: Card) => void;
  onCardSelect?: (card: Card | null) => void;
  selectedCardId?: string;
}

const Intercambio: React.FC = () => {
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [selectedUserCard, setSelectedUserCard] = useState<Card | null>(null);
  const [selectedSearchedUserCard, setSelectedSearchedUserCard] = useState<Card | null>(null);
  const { darkMode } = useTheme();
  const userId = localStorage.getItem('id_usuario');

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const response = await api.get(`/users/${userId}/cards`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserCards(response.data.cards.map((card: any) => ({
          _id: card.card._id,
          name: card.card.name,
          type: card.card.type,
          weakness: card.card.weakness,
          nPokeDex: card.card.nPokeDex,
          hp: card.card.hp,
          attacks: card.card.attacks,
          retreatCost: card.card.retreatCost,
          phase: card.card.phase,
          description: card.card.description,
          isHolographic: card.card.isHolographic,
          value: card.card.value,
          rarity: card.card.rarity,
          image: card.card.image,
        })));
      } catch (error) {
        console.error('Error fetching user cards:', error);
      }
    };

    fetchUserCards();
  }, [userId]);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/users?name=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSearchedUser(response.data);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const handleCardSelect = (card: Card | null, isUserCard: boolean) => {
    if (isUserCard) {
      setSelectedUserCard(card);
    } else {
      setSelectedSearchedUserCard(card);
    }
  };

  const handleTrade = async () => {
    if (selectedUserCard && selectedSearchedUserCard) {
      try {
        await api.post('/trade', {
          userACardId: selectedUserCard._id,
          userBCardId: selectedSearchedUserCard._id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Trade successful!');
      } catch (error) {
        console.error('Error executing trade:', error);
      }
    } else {
      alert('Please select a card from both users to trade.');
    }
  };

  return (
    <div className={`intercambio-container ${darkMode ? 'dark' : 'light'}`}>
      <NavBar />
      <div className="intercambio-content">
        <div className="user-cards">
          <h2>Mis Cartas</h2>
          <CardGallery
            cards={userCards}
            onCardSelect={(card) => handleCardSelect(card, true)}
            selectedCardId={selectedUserCard?._id}
          />
        </div>
        <div className="search-users">
          <h2>Buscar Usuarios</h2>
          <input
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
          {searchedUser && searchedUser.cards && (
            <div className="searched-user-cards">
              <h3>Cartas de {searchedUser.name}</h3>
              <CardGallery
                cards={searchedUser.cards}
                onCardSelect={(card) => handleCardSelect(card, false)}
                selectedCardId={selectedSearchedUserCard?._id}
              />
            </div>
          )}
        </div>
      </div>
      <button onClick={handleTrade} disabled={!selectedUserCard || !selectedSearchedUserCard}>
        Intercambiar
      </button>
    </div>
  );
};

export default Intercambio;
