import { PageWithNavbar } from '../../ui/page/page-with-navbar.tsx';
import './profile-page.css';

export const ProfilePage = () => {
  return (
    <PageWithNavbar>
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/src/assets/profile.png" alt="Avatar" className="avatar-image" />
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
    </PageWithNavbar>

  )
}