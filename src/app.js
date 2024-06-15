/* eslint-disable */
import "bootstrap";
import "./style.css";

import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";

document
  .getElementById("generateCard")
  .addEventListener("click", generateRandomCard);

let cardIndex = 0;

function generateRandomCard() {
  const suits = ["spade", "club", "heart", "diamond"];
  const suitSymbols = { spade: "♠", club: "♣", heart: "♥", diamond: "♦" };
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
  ];

  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
  const suitSymbol = suitSymbols[randomSuit];

  const cardContainer = document.getElementById("cardContainer");
  const newCard = document.createElement("div");
  newCard.className = `card ${randomSuit}`;
  newCard.setAttribute("data-rank", randomRank);
  newCard.setAttribute("data-suit", suitSymbol);
  newCard.style.transform = `rotate(${cardIndex *
    15}deg) translateY(${cardIndex * -10}px)`;
  newCard.style.opacity = 0;
  newCard.innerHTML = `${suitSymbol}`;

  cardContainer.appendChild(newCard);

  requestAnimationFrame(() => {
    newCard.style.opacity = 1;
    newCard.style.transform = `rotate(${cardIndex *
      15}deg) translateY(${cardIndex * -10}px) translateX(-50%)`;
  });

  cardIndex++;
  if (cardIndex >= 13) {
    cardIndex = 0;
    cardContainer.innerHTML = "";
  }
}
