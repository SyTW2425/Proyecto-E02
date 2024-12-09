import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Catalog.css';

interface Catalog {
    _id: string;
    name: string;
}

interface Card {
    _id: string;
    name: string;
    imageUrl: string;
}

const Catalog: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const response = await api.get('/catalogs');
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
                try {
                    const response = await api.get(`/catalogs/cards/${selectedCatalog}`);
                    setCards(response.data.cards);
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            fetchCards();
        }
    }, [selectedCatalog]);

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
                            <div key={card._id} className="card-item">
                                <img src={card.imageUrl} alt={card.name} />
                                <p>{card.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;