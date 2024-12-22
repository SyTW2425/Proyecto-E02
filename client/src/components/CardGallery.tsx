import React from 'react';
import Card from './Card';

interface CardProps {
    _id: string;
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
    image?: string;
    onHover?: () => void;
}

interface CardGalleryProps {
    cards: CardProps[];
    onCardHover?: (card: CardProps) => void;
    onCardSelect?: (card: CardProps | null) => void;
    selectedCardId?: string;
    className?: string;
    onAddCard?: (card: CardProps) => void; // Nueva prop opcional
}

const CardGallery: React.FC<CardGalleryProps> = ({ cards, onCardHover, onCardSelect, selectedCardId, className, onAddCard }) => {
    const sortedCards = cards.sort((a, b) => a.nPokeDex - b.nPokeDex);

    return (
        <div className={`cards-list ${className}`}>
            {sortedCards.map((card) => (
                <div
                    key={card._id}
                    className={`card-item ${selectedCardId === card._id ? 'selected' : ''}`}
                    onClick={() => onCardSelect && onCardSelect(selectedCardId === card._id ? null : card)}
                >
                    <Card
                        {...card}
                        onHover={() => onCardHover && onCardHover(card)}
                        onAddCard={onAddCard ? () => onAddCard(card) : undefined} // Pasar la función onAddCard solo si está definida
                    />
                </div>
            ))}
        </div>
    );
};

export default CardGallery;