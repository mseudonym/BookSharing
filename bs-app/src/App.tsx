import './App.css';
import avatar from './assets/UserImg.png'; // Путь к аватару

const App = () => {
    return (
        <div className="App">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img src={avatar} alt="Avatar" className="avatar-image" />
                </div>
                <div className="profile-info">
                    <p className="profile-name">Александр</p>
                    <p className="profile-surname">Михайличенко</p>
                    <p className="profile-username">@mseudonym</p>
                    <p className="profile-contact">Связаться</p>
                </div>
            </div>
            <div className="content-space">
            </div>
        </div>
    );
};

export default App;
