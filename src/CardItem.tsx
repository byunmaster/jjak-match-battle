import './CardItem.scss';

export default function CardItem({ card, opened, onClick }: { card: Card; opened: boolean; onClick(): void }) {
  const { text } = card;

  return (
    <div className={`card ${opened ? '' : 'closed'}`.trim()}>
      <button className="front">
        <div>
          <h1>{text}</h1>
        </div>
      </button>
      <button className="back" onClick={onClick}></button>
    </div>
  );
}
