import './Intro.css';
import card__icon__1 from "../../assets/card__icon__1.png";
import card__icon__2 from "../../assets/card__icon__2.png";
import card__icon__3 from "../../assets/card__icon__3.png";
import intro__icon from "../../assets/intro__icon.png";
import { useNavigate } from 'react-router-dom';


export default function Intro() {
  const navigate = useNavigate();
  return (
      <div className="intro">
        <h1 className="intro__title">Welcome to Mesh AI <img src={intro__icon} alt="Bring all your documents into one secure AI workspace" className="intro__icon" /></h1>
        <div className="intro__cards">
          <div className="intro__card">
            <img src={card__icon__1} alt="Bring all your documents into one secure AI workspace" className="card__icon" />
            <p className="intro__card-description">
              Bring all your documents into one secure AI workspace
            </p>
          </div>
          <div className="intro__card">
            <img src={card__icon__2} alt="Organize and manage the documents that power your AI" className="card__icon" />
            <p className="intro__card-description">
              Organize and manage the documents that power your AI
            </p>
          </div>
          <div className="intro__card">
            <img src={card__icon__3} alt="Your knowledge base, accessible through a simple chat interface" className="card__icon" />
            <p className="intro__card-description">
              Your knowledge base, accessible through a simple chat interface
            </p>
          </div>
        </div>
        <p className="intro__description">Start by creating your Organization’s Knowledge Base</p>
        <button className="intro__button" onClick={() => navigate('/knowledge')}>Start</button>

      </div>
  );
}
