import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Catalog.css';

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
    attacks: { name: string; energies: string[]; damage: number; effect?: string }[];
    retreatCost: string[];
    phase: string;
    description?: string;
    isHolographic: boolean;
    value: number;
    rarity: string;
}

const Catalog: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

    useEffect(() => {
        setSelectedCatalog('DefaultCatalog');
    }, []);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const response = await api.get('/catalogs/DefaultCatalog', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCatalogs(response.data.cards);
            } catch (error) {
                console.error('Error fetching catalogs:', error);
            }
        };

        fetchCatalogs();
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await api.get(`/catalogs/cards/DefaultCatalog`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Response data:', response.data); // Depuración
                const sortedCards = response.data.sort((a: Card, b: Card) => a.nPokeDex - b.nPokeDex);
                console.log('Sorted cards:', sortedCards); // Depuración
                setCards(sortedCards);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };
    
        fetchCards();
    }, []);

    return (
        <div className="catalog-container">
            <h1>Catalogs</h1>
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
                    <h2>Cards in {selectedCatalog}</h2>
                    <div className="cards-list">
                        {cards.map((card) => (
                            <div
                                key={card._id}
                                className="card-item"
                                onMouseEnter={() => setHoveredCard(card)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <p>{card.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {hoveredCard && (
                <div className="card-details">
                    <h2>{hoveredCard.name}</h2>
                    <p>Type: {hoveredCard.type}</p>
                    <p>Weakness: {hoveredCard.weakness}</p>
                    <p>Number in PokeDex: {hoveredCard.nPokeDex}</p>
                    <p>HP: {hoveredCard.hp}</p>
                    <p>Attacks: {hoveredCard.attacks?.map(attack => (
                        <div key={attack.name}>
                            <p>Name: {attack.name}</p>
                            <p>Energies: {attack.energies?.join(', ')}</p>
                            <p>Damage: {attack.damage}</p>
                            {attack.effect && <p>Effect: {attack.effect}</p>}
                        </div>
                    ))}</p>
                    <p>Retreat Cost: {hoveredCard.retreatCost?.join(', ')}</p>
                    <p>Phase: {hoveredCard.phase}</p>
                    {hoveredCard.description && <p>Description: {hoveredCard.description}</p>}
                    <p>Holographic: {hoveredCard.isHolographic ? 'Yes' : 'No'}</p>
                    <p>Value: {hoveredCard.value}</p>
                    <p>Rarity: {hoveredCard.rarity}</p>
                </div>
            )}
        </div>
    );
};

export default Catalog;