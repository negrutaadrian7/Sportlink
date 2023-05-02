import {Route, Routes} from 'react-router-dom'
import { Home, Login, SignUp, ContactUs, MyHome, CreateRoom, Room, RoomPage, ProfilInfo ,Messages} from "./exporter"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/myhome" element={<MyHome />} />
      <Route path="/createroom" element={<CreateRoom />} />
      <Route path="/room" element={<Room />} />
      <Route path="/roompage" element={<RoomPage />} />
      <Route path="/info" element={<ProfilInfo />} />
      <Route path="/Messages" element={<Messages />} />
    </Routes>
  );
}

export default App;
