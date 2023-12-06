import { Link } from 'react-router-dom';
import './StartUp.scss';

export default function StartUp() {
  return (
    <div className="wrap-start-up">
      <div className="bg" />

      <h1 className="title">짝맞추기 배틀</h1>

      <div className="menu">
        <div className="menu__list">
          <Link to={`/game`}>
            <button>시작</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
