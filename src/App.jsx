import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import ToDoWebApp from './components/dashbord/ToDoWebApp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ToDoWebApp />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
