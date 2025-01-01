import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CardFilter from './CardFilter';
import api from '../api';
import '../styles/Catalog.css';
import { useTheme } from '../context/ThemeContext';
import NavBar from './NavBar';
import CardGallery from './CardGallery';
import LoadingIndicator from './LoadingIndicator';

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
    attacks: string[]; // Cambiado a string[] para los IDs de los ataques
    retreatCost: string[];
    phase: string;
    description?: string;
    isHolographic: boolean;
    value: number;
    rarity: string;
    image?: string;
}

const Catalog: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [selectedCatalog, setSelectedCatalog] = useState<string>('DefaultCatalog');
    const [cards, setCards] = useState<Card[]>([]);
    const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
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

    return (
        <div className={`catalog-container ${darkMode ? 'dark' : 'light'}`}>
            <NavBar />
            <div className="catalog-content">
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
                                    className="catalog-card-gallery"
                                    // No pasar la función onAddCard
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;