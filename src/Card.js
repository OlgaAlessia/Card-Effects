import React, { useState } from "react";
import "./Card.css";

const Card = ({ url, alt }) => {
    const [{ angle, randomX, randomY }] = useState({
        angle: Math.random() * 90 - 45,
        randomX: Math.random() * 30 - 15,
        randomY: Math.random() * 30 - 15,
    });

    const transform = `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`;

    return <img className="Cards-img"
        style={{transform}}
        src={url}
        alt={alt}
    />

};
//end

export default Card;