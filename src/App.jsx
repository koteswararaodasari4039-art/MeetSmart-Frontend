import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import RoomList from "./pages/RoomList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import BookingForm from "./pages/BookingForm";
import Analytics from "./pages/Analytics";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path = "/admin/analytics" element = {<Analytics/>}/>
          <Route path="/book/:id" element={<BookingForm />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;