import { useCallback, useEffect, useState } from 'react';
import './Game.scss';
import Card from '../components/Card';
import Profile from '../components/Profile';

const TURN = {
  None: 0,
  My: 1,
  Com: 2,
};

const cardData = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '🫠',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '☺️',
  '😚',
  '😙',
  '🥲',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🫢',
  '🫣',
  '🤫',
  '🤔',
  '🫡',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '🫥',
  '😶‍🌫️',
  '😏',
  '😒',
  '🙄',
  '😬',
  '😮‍💨',
  '🤥',
  '🫨',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '🥴',
  '😵',
  '😵‍💫',
  '🤯',
  '🤠',
  '🥳',
  '🥸',
  '😎',
  '🤓',
  '🧐',
  '😕',
  '🫤',
  '😟',
  '🙁',
  '☹️',
  '😮',
  '😯',
  '😲',
  '😳',
  '🥺',
  '🥹',
  '😦',
  '😧',
  '😨',
  '😰',
  '😥',
  '😢',
  '😭',
  '😱',
  '😖',
  '😣',
  '😞',
  '😓',
  '😩',
  '😫',
  '🥱',
  '😤',
  '😡',
  '😠',
  '🤬',
  '😈',
  '👿',
].map((text, index) => ({ id: index, text, opened: false }));

const pickUp = (count: number) => {
  const result: ICard[] = [];
  while (result.length < count * 2) {
    const index = Math.floor(Math.random() * cardData.length);
    if (!result.includes(cardData[index])) {
      result.push(cardData[index]);
      result.push({ ...cardData[index] });
    }
  }
  return result.sort(() => Math.random() - 0.5);
};

const com: { memory: number; memorized: ICard[]; addMemory(card: ICard): void } = {
  memory: 5,
  memorized: [],
  addMemory(card: ICard) {
    if (this.memorized.includes(card)) {
      return;
    }
    if (this.memorized.length >= this.memory) {
      this.memorized.shift();
    }
    this.memorized.push(card);
  },
};

export default function Game() {
  const [stage, setStage] = useState(1);
  const [count, setCount] = useState(3);
  const [myScore, setMyScore] = useState(0);
  const [comScore, setComScore] = useState(0);
  const [turn, setTurn] = useState(TURN.None);

  const [cards, setCards] = useState<ICard[]>(pickUp(15));
  const [openedCards, setOpenedCards] = useState<ICard[]>([]);

  const start = () => {
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCount(count);
      if (count <= 0) {
        setTurn(TURN.My);
        clearInterval(interval);
      }
    }, 1000);

    return interval;
  };

  useEffect(() => {
    const interval = start();
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = useCallback(
    (card: ICard) => {
      if (openedCards.length >= 2 || !card || card.opened) {
        return;
      }
      card.opened = true;
      com.addMemory(card);
      setOpenedCards([...openedCards, card]);
    },
    [openedCards]
  );

  const addScore = useCallback(() => {
    if (turn === TURN.My) {
      setMyScore(myScore + 1);
    } else if (turn === TURN.Com) {
      setComScore(comScore + 1);
    }
  }, [turn, myScore, comScore]);

  const nextTurn = useCallback(() => {
    setTurn(turn === TURN.My ? TURN.Com : TURN.My);
  }, [turn]);

  const comAction = useCallback(() => {
    if (openedCards.length === 0) {
      for (let i = 0, len = com.memorized.length; i < len; i++) {
        if (com.memorized.filter(({ id }) => id === com.memorized[i].id).length === 2) {
          setTimeout(() => handleCardClick(com.memorized[i]), 500);
          return;
        }
      }
      const targets = cards.filter((card) => !com.memorized.includes(card) && !card.opened);
      setTimeout(() => handleCardClick(targets[Math.floor(Math.random() * targets.length)]), 500);
    } else if (openedCards.length === 1) {
      const memorizedCard = com.memorized.find((card) => card.id === openedCards[0].id && card !== openedCards[0]);
      if (memorizedCard) {
        setTimeout(() => handleCardClick(memorizedCard), 500);
      } else {
        const targets = cards.filter((card) => !com.memorized.includes(card) && !card.opened);
        setTimeout(() => handleCardClick(targets[Math.floor(Math.random() * targets.length)]), 500);
      }
    }
  }, [cards, openedCards, handleCardClick]);

  const reset = useCallback(() => {
    setCards(pickUp(15));
    setMyScore(0);
    setComScore(0);
    setOpenedCards([]);
    start();
  }, []);

  const finish = useCallback(() => {
    alert(`${myScore > comScore ? '이겼다!' : '졌다 ㅠㅠ'}`);
    if (myScore > comScore) {
      setStage(stage + 1);
      com.memory += 2;
      com.memorized = [];
    }
    reset();
  }, [myScore, comScore, stage, reset]);

  useEffect(() => {
    switch (openedCards.length) {
      case 1:
        if (turn === TURN.Com) {
          comAction();
        }
        break;
      case 2:
        setTimeout(() => {
          const [card1, card2] = openedCards;
          if (card1.id === card2.id) {
            addScore();
            if (cards.length === cards.filter(({ opened }) => opened).length) {
              finish();
              return;
            }
            com.memorized = com.memorized.filter((card) => card.id !== card1.id);
            setOpenedCards([]);
            if (turn === TURN.Com) {
              comAction();
            }
          } else {
            card1.opened = false;
            card2.opened = false;
            setOpenedCards([]);
            nextTurn();
          }
        }, 1000);
        break;
    }
  }, [openedCards, cards, turn, addScore, comAction, nextTurn, finish]);

  useEffect(() => {
    if (turn === TURN.Com && openedCards.length === 0) {
      comAction();
    }
  }, [turn, openedCards, comAction]);

  return (
    <div className="wrap-game">
      <header>
        <div className="wrap-profile">
          <Profile name="나" score={myScore} active={turn === TURN.My} />
        </div>
        <div>
          <h2>Stage {stage}</h2>
          <h2>{count > 0 ? count : 'Fight'}</h2>
        </div>
        <div className="wrap-profile">
          <Profile name="COM" score={comScore} active={turn === TURN.Com} />
        </div>
      </header>

      <div className="wrap-board">
        <div className="board">
          {cards.map((card, index) => (
            <Card
              key={`${index}-${card.id}`}
              card={card}
              opened={count > 0 || card.opened}
              onClick={turn === TURN.My ? () => handleCardClick(card) : () => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
