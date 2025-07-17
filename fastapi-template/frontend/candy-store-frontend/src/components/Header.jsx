import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../assets/logo.png'; // Ajusta la ruta según la ubicación de tu logo

const Header = () => {
    const [cartItems, setCartItems] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Actualizar el contador del carrito
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
            setCartItems(totalItems);
        };

        updateCartCount();

        // Escuchar cambios en localStorage
        window.addEventListener('storage', updateCartCount);
        
        return () => {
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <header className="header">
            {/* Barra superior */}
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="desktop-links">
                        <Link to="/politica-reembolso">Política de reembolso</Link>
                        <Link to="/mi-cuenta">Mi cuenta</Link>
                        <Link to="/nosotros">Nosotros</Link>
                        <Link to="/lista-deseos">Lista de deseos</Link>
                        <Link to="/carrito">Mi carrito</Link>
                    </div>
                </div>
            </div>

            {/* Barra principal */}
            <div className="main-navbar">
                <div className="main-navbar-container">
                    <div className="navbar-content">
                        {/* Botón menú hamburguesa (solo móvil) */}
                        <button 
                            className="menu-toggle" 
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                        >
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                        
                        {/* Logo (imagen en vez de texto) */}
                        <Link to="/home" className="logo">
                            <img 
                                src={logoImage} 
                                alt="CONFIMARKET" 
                                className="logo-image"
                            />
                        </Link>
                        
                        {/* Carrito */}
                        <div className="cart-wrapper">
                            <span className="cart-total">$0</span>
                            <Link to="/carrito" className="cart">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                                {cartItems > 0 && <span className="cart-badge">{cartItems}</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isMenuOpen && (
                <div className="mobile-menu-backdrop" onClick={toggleMenu}></div>
            )}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span>Menú</span>
                    <button className="close-menu" onClick={toggleMenu}>&times;</button>
                </div>
                <nav className="mobile-nav">
                    <div className="mobile-nav-section">
                        <h3>Navegación</h3>
                        <Link to="/home" onClick={handleLinkClick}>Inicio</Link>
                        <Link to="/dulceria" onClick={handleLinkClick}>Dulcería</Link>
                        <Link to="/contacto" onClick={handleLinkClick}>Contacto</Link>
                        <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
                    </div>
                    <div className="mobile-nav-section">
                        <h3>Mi cuenta</h3>
                        <Link to="/mi-cuenta" onClick={handleLinkClick}>Mi cuenta</Link>
                        <Link to="/lista-deseos" onClick={handleLinkClick}>Lista de deseos</Link>
                        <Link to="/carrito" onClick={handleLinkClick}>Mi carrito</Link>
                    </div>
                    <div className="mobile-nav-section">
                        <h3>Información</h3>
                        <Link to="/politica-reembolso" onClick={handleLinkClick}>Política de reembolso</Link>
                        <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;