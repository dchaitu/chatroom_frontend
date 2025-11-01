import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import React from 'react';
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import ShowUserRooms from "./components/showUserRooms";
import GetMessagesFromRoom from "./components/getMessagesFromRoom";
import UserProfile from "./components/userProfile";
import InvalidRoute from "./components/invalidRoute";
import GetOldMessages from "./components/getOldMessages";
import ProtectedRoute from "./components/protectedRoute";
import {AuthProvider} from "./context/context";
import {ReplyProvider} from "./context/ReplyContext";
import {UserProvider} from "./context/userContext";
import AddEmojiToMessage from "./constants/addEmojiToMessage";
import {AllUserProvider} from "./context/allUserContext";
import {TooltipProvider} from "./components/ui/tooltip";

function App() {
  return (
    <AuthProvider>
      <ReplyProvider>
        <UserProvider>
          <AllUserProvider>
              <TooltipProvider>
                <Router>
                  <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/" element={<Home />} />
                    <Route path="/" element={<ProtectedRoute />}>
                      <Route path="/room/user" element={<ShowUserRooms/>} />
                      <Route exact path="/rooms/:room_id/messages/" element={<GetMessagesFromRoom/>}/>
                      <Route exact path="/user/" element={<UserProfile/>}/>
                      <Route path="/messages/:roomId" element={<GetOldMessages/>}/>
                      <Route path="/invalid" element={<InvalidRoute />} />
                    </Route>
                    <Route path="/emoji" element={<AddEmojiToMessage/>}/>
                    <Route path="*" element={<Navigate to="/invalid" />} />
                  </Routes>
                </Router>
              </TooltipProvider>
          </AllUserProvider>
        </UserProvider>
      </ReplyProvider>
    </AuthProvider>
  );
}

export default App;
