import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Container } from '@mui/material';

import store from '../app/store';
import DefaultLayout from './navigation/defaultLayout';
import Navigation from './navigation/navigation';
import ProtectedLayout from './navigation/protectedLayout';
import NotificationBar from './notification/notificationBar';
import Discover from './pages/discover';
import Home from './pages/home';
import Login from './pages/login';
import ManageAccount from './pages/manageAccount';
import Movies from './pages/movies';
import Profile from './pages/profile';
import Register from './pages/register';
import Search from './pages/search';
import ShowSeasons from './pages/showSeasons';
import Shows from './pages/shows';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <BrowserRouter>
          <Navigation />
          <NotificationBar />
          <div className="content">
            <Container maxWidth="xl" sx={{ p: 1 }}>
              <Routes>
                <Route element={<DefaultLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<ProtectedLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shows" element={<Shows />} />
                  <Route path="/shows/:showId/:profileId" element={<ShowSeasons />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/manageAccount" element={<ManageAccount />} />
                  <Route path="/profile/:profileId" element={<Profile />} />
                </Route>
              </Routes>
            </Container>
          </div>
        </BrowserRouter>
        <footer className="footer">
          <p>Gifford Family Dev</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
