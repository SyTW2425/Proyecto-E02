import React, { useEffect, useState } from 'react';
import '../styles/Card.css';
import api from '../api';

const token = localStorage.getItem('token');

interface Attack {
    name: string;
    energies: string[];
    damage: number;
    effect?: string;
}

interface CardProps {
    image?: string;
    name: string;
    type: string;
    weakness: string;
    nPokeDex: number;
    hp: number;
    attacks: string[];
    retreatCost: string[];
    phase: string;
    description?: string;
    isHolographic: boolean;
    value: number;
    rarity: string;
    onHover?: () => void;
    onAddCard?: () => void; // Nueva prop opcional
}

const fetchAttackDetails = async (attackIds: string[]) => {
    try {
        const attackDetails = await Promise.all(
            attackIds.map(async (id) => {
                const response = await api.get(`/attacks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return response.data.attack;
            })
        );
        return attackDetails;
    } catch (error) {
        console.error('Error fetching attack details:', error);
        return [];
    }
};

const Card: React.FC<CardProps> = ({
    image,
    name,
    type,
    weakness,
    nPokeDex,
    hp,
    attacks,
    retreatCost,
    phase,
    description,
    isHolographic,
    value,
    rarity,
    onHover,
    onAddCard, // Nueva prop opcional
}) => {
    const [attackDetails, setAttackDetails] = useState<Attack[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const getAttackDetails = async () => {
            const details = await fetchAttackDetails(attacks);
            setAttackDetails(details);
        };
        getAttackDetails();
    }, [attacks]);

    const handleMouseMove = (e: React.MouseEvent, cardElement: HTMLDivElement) => {
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (x - centerX) / 20;
        cardElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (cardElement: HTMLDivElement) => {
        cardElement.style.transform = 'rotateX(0) rotateY(0)';
        setIsHovered(false);
    };

    return (
        <div
            className={`card-item ${type} card--shadow ${isHovered ? 'card--shimmer' : ''}`}
            onMouseEnter={() => {
                onHover && onHover();
                setIsHovered(true);
            }}
            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
            <div className="card">
                <div className="card__img-wrapper">
                    <img
                        src={image || '/images/img-dorso-carta.png'}
                        alt={name}
                        className="card__img card__img--front"
                    />
                    {isHovered && <div className="card__shine card__shine-shimmer"></div>}
                </div>
            </div>
            <div className="card-info">
                <p className="card-name">{name}</p>
                {onAddCard && (
                    <button className="add-card-button" onClick={onAddCard}>
                        Añadir Carta
                    </button>
                )}
            </div>
        </div>
    );
};

export default Card;
