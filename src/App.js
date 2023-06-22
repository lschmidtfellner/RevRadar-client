import { Routes, Route } from 'react-router-dom';
import React, { useContext } from 'react';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

import { CarContextProvider } from './components/CarContextProvider';
import FeaturedCars from './components/FeaturedCars';
import CreateNewListing from './pages/CreateNewListing';
import api from './api/apiConfig';
import AuthContextComponent, { AuthContext } from './context/AuthContextComponent';
import Nav from './components/Nav';

function App() {
  return (
    <AuthContextComponent> {/* Use the AuthContextComponent to wrap the app */}
      <AppContent />
    </AuthContextComponent>
  );
}

const AppContent = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  return (

    <CarContextProvider>
      <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/api/saleposts" element={isLoggedIn ? <FeaturedCars /> : <Signin />} />
      </Routes>
    </CarContextProvider>
  );
}

export default App;
