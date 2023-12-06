import React, { useState, useEffect, useRef } from "react";
import Card from './Card'
import "./Deck.css";
import axios from "axios";

const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const automaticDrawId = useRef();

    useEffect(function fetchDeckFromAPI() {
        async function createDeck() {
            const result = await axios.get(`${CARDS_API_URL}/new/shuffle/`);
            setDeck(result.data);
        }
        createDeck();
    }, []);


    useEffect(function callDraw() {
        if (isStart) {
            automaticDrawId.current = setInterval(() => drawCard(), 1000);
        }
    }, [isStart]);

    /** Draw card: change the state of setCards*/
    async function drawCard() {
        try {
            const respDeck = await axios.get(`${CARDS_API_URL}/${deck.deck_id}/draw/?count=1`);
            if (respDeck.data.remaining === 0) {
                setIsStart(false);
                clearInterval(automaticDrawId.current);
                throw new Error("No cards remaining!");
            }
            const card = respDeck.data.cards[0];
            setCards(cards => [...cards, {
                id: card.code,
                url: card.image,
                name: `${card.value} OF ${card.suit}`
            }]);
        } catch (e) {
            alert(e);
        }
    }


    /** Return draw button (disabled if shuffling) 
    function btnDrawn() {
        if (!deck) return null;
        return (
            <button className="Deck-btn"
                onClick={drawCard}
                disabled={isShuffling} >GIMME A CARD!</button>
        );
    }*/

    function btnStartDrawn() {
        if (!deck) return null;
        return (
            <button className="Deck-btn"
                onClick={() => setIsStart(true)}
                disabled={isShuffling} >Start drawing</button>
        );
    }

    const stopDraw = () => {
        setIsStart(false);
        clearInterval(automaticDrawId.current);
    }

    function btnStopDrawn() {
        if (!deck) return null;
        return (
            <button className="Deck-btn"
                onClick={stopDraw}
                disabled={isShuffling} >Stop drawing</button>
        );
    }


    /** Shuffle: change the state of isShuffling,   & effect will kick in. */
    async function shuffleDeck() {
        try {
            setIsShuffling(true);
            await axios.get(`${CARDS_API_URL}/${deck.deck_id}/shuffle/`);
            setCards([]);
        } catch (e) {
            alert(e);
        } finally {
            setIsShuffling(false);
        }
    }

    /** Return shuffle button (disabled if already is) */
    function btnShuffle() {
        if (!deck) return null;

        return (
            <button className="Deck-btn"
                onClick={shuffleDeck}
                disabled={isShuffling} >Shuffle Deck</button>
        );
    }

    return (
        <section>
            {!isStart ? btnStartDrawn() : btnStopDrawn()}

            {btnShuffle()}

            <div className="Deck">
                {cards.map(({ id, url, name }) =>
                    <Card key={id} url={url} alt={name} />
                )}
            </div>
        </section>
    );

};
//end

export default Deck;