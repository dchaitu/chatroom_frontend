import {Link, useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');  // Redirect to login page on button click
    };

    const handleSignUpClick = () => {
        navigate('/register');
    }

    return (<div>
            <h1>Home Page</h1>
            {/* navlink to login */}
            <Link to="/register" className="login-button"
                  onClick={handleSignUpClick}>
                Sign Up
            </Link>

            <Link to="/login" className="login-button"
                  onClick={handleLoginClick}>
                Login
            </Link>
            <main>
                <h2>ChatRoom App</h2>
                <p> The App is used to host rooms and join rooms by logging in and send messages</p>

            </main>
        </div>
    )



}
export default Home;