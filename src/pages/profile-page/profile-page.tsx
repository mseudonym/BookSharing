import { Navbar } from '../../components/navbar/navbar';
import { Page } from '../../ui/page/page';
import './profile-page.css';

export const ProfilePage = () => {
  return (
    <Page>
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/src/assets/UserImg.png" alt="Avatar" className="avatar-image" />
        </div>
        <div className="profile-info">
          <p className="profile-name">Александр</p>
          <p className="profile-surname">Михайличенко</p>
          <p className="profile-username">@mseudonym</p>
          <p className="profile-contact">Связаться</p>
        </div>
      </div>
      <Navbar></Navbar>
      <div className="content-space">
      </div>
    </Page>

  )
}