import React, { useState } from 'react';
import api from '../api';
import '../styles/CardFilter.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardFilterProps {
    onFilter: (filteredCards: any[]) => void;
    setLoading: (loading: boolean) => void;
}

const CardFilter: React.FC<CardFilterProps> = ({ onFilter, setLoading }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [value, setValue] = useState('');
    const [rarity, setRarity] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/catalogs/search/DefaultCatalog`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: { name, type, value, rarity },
            });
            console.log('response:', response);
            onFilter(response.data);
        } catch (error) {
            console.error('Error al filtrar cartas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setName('');
        setType('');
        setValue('');
        setRarity('');
        setLoading(true);
        try {
            const response = await api.get(`/catalogs/cards/DefaultCatalog`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            onFilter(response.data); // Actualiza los resultados con todas las cartas
        } catch (error) {
            console.error('Error al restablecer cartas:', error);
        } finally {
            setLoading(false);
        }
    };

    const typeColors: { [key: string]: string } = {
        Grass: '#78C850',
        Fire: '#F08030',
        Water: '#6890F0',
        Lightning: '#F8D030',
        Psychic: '#F85888',
        Fighting: '#C03028',
        Darkness: '#705848',
        Metal: '#B8B8D0',
        Fairy: '#EE99AC',
        Dragon: '#7038F8',
        Colorless: '#A8A878',
    };

    return (
        <div className="filter-container">
            <h2>Filtrar Cartas</h2>
            <div className="filter-group">
                <label htmlFor="name">Nombre de la carta</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Pikachu"
                    className="form-control"
                />
            </div>
            <button
                className="btn btn-secondary toggle-button"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? 'Ocultar opciones' : 'Mostrar más opciones'}
            </button>
            {isExpanded && (
                <>
                    <div className="filter-group">
                        <label htmlFor="type">Tipo</label>
                        <div className="type-buttons">
                            {Object.keys(typeColors).map((typeKey) => (
                                <button
                                    key={typeKey}
                                    onClick={() => setType(type === typeKey ? '' : typeKey)}
                                    className={`btn btn-secondary ${type === typeKey ? 'selected' : ''}`}
                                    style={{ backgroundColor: type === typeKey ? typeColors[typeKey] : undefined }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = typeColors[typeKey])}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = type === typeKey ? typeColors[typeKey] : '')}
                                >
                                    {typeKey}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="value">Valor</label>
                        <input
                            type="number"
                            id="value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Ej. 10"
                            className="form-control"
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="rarity">Rareza</label>
                        <select id="rarity" value={rarity} onChange={(e) => setRarity(rarity === e.target.value ? '' : e.target.value)} className="form-select">
                            <option value="">Todas</option>
                            <option value="Common">Common</option>
                            <option value="Uncommon">Uncommon</option>
                            <option value="Rare">Rare</option>
                            <option value="Ultra Rare">Ultra Rare</option>
                        </select>
                    </div>
                </>
            )}
            <div className="filter-actions">
                <button onClick={handleSearch} className="btn btn-primary search-button">Buscar</button>
                <button onClick={handleReset} className="btn btn-secondary reset-button">Restablecer</button>
            </div>
        </div>
    );
};

export default CardFilter;