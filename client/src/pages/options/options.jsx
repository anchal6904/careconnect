
import './index.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* <div className="header">
        <h1 className="brand-name">
          CareConnect<span>Connect</span>
        </h1>
      </div> */}
      
      <h1 className="welcome-title">Welcome to CareConnect</h1>
      <h3 className="subtitle">Choose how you want to use this application</h3>

      <div className="role-options">
        <div className="role">
          <div className="avatar patient"></div>
          <p className="role-title">I&asop;m a Patient</p>
          <p className="role-desc">Find and book appointments with doctors</p>
        </div>
        <div className="role">
          <div className="avatar doctor"></div>
          <p className="role-title">I&asop;m a Doctor</p>
          <p className="role-desc">Manage your appointments and patients</p>
        </div>
      </div>

      <p className="support-text">
        Need help? <a href="#">Contact support</a>
      </p>
    </div>
  );
};

export default Home;
