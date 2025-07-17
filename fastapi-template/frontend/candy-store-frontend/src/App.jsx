import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';

import Home from './pages/Home';
import About from './pages/About';
import CandyList from './components/CandyList';
import Login from './pages/Login'; // Importa el componente Login
import ProductDetail from './pages/ProductDetail'; // Importa el componente ProductDetail
import Cart from './pages/Cart'; // Importa el componente Cart
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    {/* Ruta para Login */}
                    <Route path="/login" component={Login} />
                    
                    {/* Ruta para Home */}
                    <Route path="/home">
                        <Header />
                        <Home />
                    </Route>

                    {/* Ruta para About */}
                    <Route path="/about">
                        <Header />
                        <About />
                    </Route>

                    {/* Ruta para Candies */}
                    <Route path="/candies">
                        <Header />
                        <CandyList />
                    </Route>

                    {/* Ruta para Detalles del Producto */}
                    <Route path="/productos/:id">
                        <Header />
                        <ProductDetail />
                    </Route>

                    {/* Ruta para el Carrito */}
                    <Route path="/carrito">
                        <Header />
                        <Cart />
                    </Route>

                    {/* Redirigir la raíz (/) al Login */}
                    <Redirect exact from="/" to="/login" />
                </Switch>
            </div>
        </Router>
    );
}

export default App;