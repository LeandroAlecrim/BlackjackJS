//
//#region Globals
//
const VALUES = [
  'A', // Ás
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J', // Valete
  'Q', // Rainha
  'K', // Rei
];
const TYPES = ['C', 'D', 'H', 'S']; // Clubs/Paus, Diamonds/Ouro, Hearts/Copas, Spades/Espadas

let dealerSum;
let yourSum;
let dealerAceCount;
let yourAceCount; // A, 2 + K => 1 + 2 + 10;

let deck; // baralho
let hiddenCard; // carta oculta da banca
let canHit; // permite o jogador comprar enquanto soma <= 21

//
//#endregion Globals
//

window.onload = function () {
  init();
};

//
//#region Functions
//
function init() {
  reset();
  buildDeck();
  shuffleDeck();
  startGame();

  // event listener
  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stay').addEventListener('click', stay);
  document.getElementById('restart').addEventListener('click', init);
}

function reset() {
  // variáveis
  dealerSum = 0;
  yourSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;
  deck = [];
  hiddenCard = null;
  canHit = true;

  // DOM
  document.getElementById('results').innerText = '';
  document.getElementById('your-sum').innerText = '';
  document.getElementById('dealer-sum').innerText = '';
  document.getElementById('your-cards').innerHTML = '';
  document.getElementById('dealer-cards').innerHTML = '';
  document.getElementById('dealer-cards').appendChild(hiddenCardImage());
  document.getElementById('hit').classList.replace('button-hidden', 'button');
  document.getElementById('stay').classList.replace('button-hidden', 'button');
  document
    .getElementById('restart')
    .classList.replace('button', 'button-hidden');
}

function buildDeck() {
  deck = [];

  TYPES.forEach((type) => {
    const suit = VALUES.map((value) => `${value}-${type}`); // mapeia naipe para cada tipo -> [A-C, ..., K-C]
    deck.push(...suit);
  });
}

function shuffleDeck() {
  deck.sort(() => Math.random() - 0.5);
}

function startGame() {
  hiddenCard = deck.pop();
  dealerSum += getValue(hiddenCard);
  dealerAceCount += checkAce(hiddenCard);

  while (dealerSum < 17) {
    drawCard('dealer-cards');
  }

  for (let i = 0; i < 2; i++) {
    drawCard('your-cards');
  }
}

function hiddenCardImage() {
  const img = document.createElement('img');
  img.src = './cards/BACK.png';
  img.setAttribute('id', 'hidden');
  return img;
}

function cardImage(card) {
  const img = document.createElement('img');
  img.src = './cards/' + card + '.png'; // <img src="./cards/4-C.png" >
  return img;
}

function drawCard(elementId) {
  const card = deck.pop();

  if (elementId === 'your-cards') {
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
  } else if (elementId === 'dealer-cards') {
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
  }

  document.getElementById(elementId).append(cardImage(card));
}

function hit() {
  if (!canHit) return;
  drawCard('your-cards');
}

function stay() {
  canHit = false;
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  // DOM
  document.getElementById('hidden').src = './cards/' + hiddenCard + '.png';
  document.getElementById('dealer-sum').innerText = dealerSum;
  document.getElementById('your-sum').innerText = yourSum;
  document.getElementById('results').innerText = result();
  document.getElementById('hit').classList.replace('button', 'button-hidden');
  document.getElementById('stay').classList.replace('button', 'button-hidden');
  document
    .getElementById('restart')
    .classList.replace('button-hidden', 'button');
}

function result() {
  // quando alguém ultrapassar 21
  if (yourSum > 21) return 'You Lose!';
  if (dealerSum > 21) return 'You Win!';
  // ambos com menos de 21
  if (yourSum === dealerSum) return 'Tie!';
  if (yourSum > dealerSum) return 'You Win!';
  if (yourSum < dealerSum) return 'You Lose!';
}

function getValue(card) {
  let data = card.split('-'); // 4-C => ['4', 'C']
  let value = data[0];

  if (isNaN(value)) {
    return checkAce(card) ? 11 : 10; // A => 11 // J, Q, K => 10
  }
  return parseInt(value); // 2 - 10
}

function checkAce(card) {
  return card.startsWith('A') ? 1 : 0;
}

/** Retorna a soma. Reduz Ás para 1 enquanto a soma for maior que 21 */
function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }
  return sum;
}
//
//#endregion Functions
//
