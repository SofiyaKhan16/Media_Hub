import { GoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyGoogleToken } from '../../api/account';
import { getCookie } from '../../api/cookies';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('jwtToken');
    if (token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      console.log(credentialResponse);
      await verifyGoogleToken(credentialResponse.credential);
      navigate('/home');
    } catch (error) {
      console.error('Google verification failed:', error);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="login-container">
      <div className="card-wrapper">
        <div className="login-card">
          <div className="login-content">
            <div className="logo-section">
              <div className="logo-login">
                <span className="logo-text-login">✓</span>
              </div>
              <h1 className="login-title">Media Hub</h1>
              <div className="title-underline"></div>
            </div>
            
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Sign in to continue to your workspace</p>
            </div>
            
            <div className="google-button-container">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="filled_blue"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>
            
            <div className="terms">
              <p className="terms-text">
                By signing in, you agree to Media Hub's{' '}
                <span className="terms-link">Terms of Service</span>{' '}
                and{' '}
                <span className="terms-link">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;