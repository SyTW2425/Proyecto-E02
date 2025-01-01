import React, { useState, useEffect } from 'react';
import '../styles/Mycollection.css';
import api from '../api';
import { useTheme } from '../context/ThemeContext';
import NavBar from './NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Card {
  _id: string;
  name: string;
  type: string;
  weakness: string;
  nPokeDex: number;
  hp: number;
  attacks: { name: string; energies: string[]; damage: number; effect?: string }[];
  retreatCost: string[];
  phase: string;
  description?: string;
  isHolographic: boolean;
  value: number;
  rarity: string;
  image?: string;
}

const MyCollection: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const { darkMode } = useTheme();
  const userId = localStorage.getItem('id_usuario');
  const username = localStorage.getItem('nombre_usuario');

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const response = await api.get(`/users/${userId}/cards`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCards(response.data.cards.map((card: any) => ({
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

  const handleDeleteCard = async (cardId: string) => {
    try {
      await api.delete(`/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCards(cards.filter(card => card._id !== cardId));
      console.log(`Card ${cardId} deleted`);
      toast.success('Card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Error deleting card');
    }
  };

  return (
    <div className={`collection-container ${darkMode ? 'dark' : 'light'}`}>
        <NavBar />
      <main className="collection-content">
      <ToastContainer />
        <h1>Mi Colección</h1>
        <a href={`/cartas/add/${username}`} className="add-card-button">Añadir Carta</a>
        <div className="cards-content">
          {cards.length === 0 ? (
            <p>No se encontraron cartas.</p>
          ) : (
            <div className="cards-list">
              {cards.map((card) => (
                <div key={card._id} className={`card-item ${card.type}`}>
                  <div className="card">
                    <div className="card__img-wrapper">
                      <img
                        src={card.image || '/images/img-dorso-carta.png'}
                        alt={card.name}
                        className="card__img"
                      />
                    </div>
                    <div className="card-info">
                      <p>{card.name}</p>
                      <p>Type: {card.type}</p>
                      <p>HP: {card.hp}</p>
                      <button onClick={() => handleDeleteCard(card._id)}>Eliminar Carta</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCollection;

