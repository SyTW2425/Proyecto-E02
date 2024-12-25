import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CardFilter from './CardFilter';
import api from '../api';
import '../styles/AddCard.css';
import { useTheme } from '../context/ThemeContext';
import NavBar from './NavBar';
import CardGallery from './CardGallery';
import LoadingIndicator from './LoadingIndicator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const token = localStorage.getItem('token');
console.log('token:', token);

interface Catalog {
    _id: string;
    name: string;
}

interface Card {
    _id: string;
    name: string;
    type: string;
    weakness: string;
    nPokeDex: number;
    hp: number;
    attacks: string[]; // Changed to string[] for attack IDs
    retreatCost: string[];
    phase: string;
    description?: string;
    isHolographic: boolean;
    value: number;
    rarity: string;
    image?: string;
}

const AddCard: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [selectedCatalog, setSelectedCatalog] = useState<string>('DefaultCatalog');
    const [cards, setCards] = useState<Card[]>([]);
    const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
    const username = localStorage.getItem('nombre_usuario'); // Assuming username is stored in localStorage
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const response = await api.get('/catalogs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCatalogs(response.data);
            } catch (error) {
                console.error('Error fetching catalogs:', error);
            }
        };

        fetchCatalogs();
    }, []);

    useEffect(() => {
        if (selectedCatalog) {
            const fetchCards = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/catalogs/cards/${selectedCatalog}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('response:', response);
                    const sortedCards = response.data.sort((a: Card, b: Card) => a.nPokeDex - b.nPokeDex);
                    setCards(sortedCards);
                } catch (error) {
                    console.error('Error fetching cards:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCards();
        }
    }, [selectedCatalog]);

    const { darkMode } = useTheme();

    const handleFilter = (filteredCards: Card[]) => {
        setCards(filteredCards);
    };

    const fetchAttackDetails = async (attackIds: string[]) => {
        try {
            const attackDetails = await Promise.all(
                attackIds.map(async (id) => {
                    const response = await api.get(`/attacks/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('Attack details:', response.data);
                    return response.data.attack;
                })
            );
            return attackDetails;
        } catch (error) {
            console.error('Error fetching attack details:', error);
            return [];
        }
    };

    const handleAddCard = async (card: Card | null) => {
        if (!card) return;
        try {
            const attacks = await fetchAttackDetails(card.attacks);
            const response = await api.post(`/cards/${username}`, {
                name: card.name,
                nPokeDex: card.nPokeDex,
                type: card.type,
                weakness: card.weakness,
                hp: card.hp,
                attacks: attacks.map(attack => ({
                    name: attack.name,
                    energies: attack.energies,
                    damage: attack.damage,
                    effect: attack.effect || "", // Ensure effect is included
                })),
                retreatCost: card.retreatCost,
                phase: card.phase,
                description: card.description || "", // Ensure description is included
                isHolographic: card.isHolographic,
                value: card.value,
                rarity: card.rarity,
                image: card.image || "", // Ensure image is included
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Card added:', response.data);
            toast.success('Card added successfully!');
        } catch (error) {
            console.error('Error adding card:', error);
            toast.error('Failed to add card.');
        }
    };

    return (
        <div className={`add-card-container ${darkMode ? 'dark' : 'light'}`}>
            <NavBar />
            <div className="add-card-content">
                <ToastContainer />
                <CardFilter onFilter={handleFilter} setLoading={setLoading} />
                <h1>Catálogos</h1>
                <div className="catalog-list">
                    {catalogs.map((catalog) => (
                        <div
                            key={catalog._id}
                            className="catalog-item"
                            onClick={() => setSelectedCatalog(catalog.name)}
                        >
                            {catalog.name}
                        </div>
                    ))}
                </div>
                {selectedCatalog && (
                    <div className="cards-container">
                        {loading ? (
                            <LoadingIndicator />
                        ) : (
                            cards.length === 0 ? (
                                <p>No se encontraron cartas.</p>
                            ) : (
                                <CardGallery 
                                    cards={cards} 
                                    onCardHover={setHoveredCard} 
                                    className="add-card-gallery"
                                    onAddCard={handleAddCard} // Pasar la función handleAddCard
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCard;