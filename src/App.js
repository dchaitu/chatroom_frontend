import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { ThemeProvider } from "@material-tailwind/react";

import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import Rooms from "./components/rooms";


function App() {
  return (
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/rooms" element={<Rooms />} />
            {/*<Route exact path="/add" element={<AddTaskUser />} />*/}
            {/*<Route exact path="/set-username" element={<SelectUserName/>} />*/}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
