import {Navbar} from '../../components/navbar/navbar';
import './friends-page.css';
import React from 'react';
export const FriendsPage: React.FC = () => {
    const handleMyFriendsClick = () => {
        alert("Показать моих друзей");
    };

    const handleRequestsClick = () => {
        alert("Показать заявки");
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f4f4'
        }}>
            {/* Верхняя часть страницы */}
            <div style={{marginTop: '20px'}}>
                <h1>Друзья</h1>

                {/* Кнопки */}
                <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
                    <button onClick={handleMyFriendsClick} style={buttonStyle}>Мои друзья</button>
                    <button onClick={handleRequestsClick} style={buttonStyle}>Заявки</button>
                </div>

                {/* Картинка и подпись */}
                <div style={{marginTop: '30px', textAlign: 'center'}}>
                    <div className="container">
                        <div className="cloud left"></div>
                        <div className="cloud right"></div>

                        <div className="ghost">
                            <div className="ghost-eyes">
                                <div className="ghost-eye"></div>
                                <div className="ghost-eye"></div>
                            </div>
                        </div>

                        <div className="ground"></div>
                    </div>
                    <p style={{marginTop: '10px', color: '#666'}}>Пока друзей нет</p>
                </div>
            </div>

            {/* Нижняя часть страницы — Navbar */}
            <div style={{marginTop: 'auto', width: '100%'}}>
                <Navbar></Navbar>
            </div>
        </div>
    );
};

// Стили для кнопок
const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
};
