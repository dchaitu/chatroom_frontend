import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import ShowUserRooms from "./components/showUserRooms";
import GetMessagesFromRoom from "./components/getMessagesFromRoom";
import UserProfile from "./components/userProfile";


function App() {
  return (
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/rooms" element={<ShowUserRooms />} />
            <Route exact path="/rooms/messages/" element={<GetMessagesFromRoom />} />
            <Route exact path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
