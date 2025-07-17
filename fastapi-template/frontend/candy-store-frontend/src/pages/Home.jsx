import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bannerImage from '../assets/banner.png';
import './home.css'; 

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);

    useEffect(() => {
        // Cargar categorías
        axios.get('http://127.0.0.1:8000/categorias')
            .then(response => {
                setCategories(response.data.categorias || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                
                setCategories([
                    { id: 1, nombre: 'DULCERÍA', productos_count: 142, imagen_url: 'https://www.zarla.com/images/zarla-candy-store-website-examples-5472x3648-20240621.jpeg?width=1056&dpr=2&crop=2:1&format=jpg' },
                    { id: 2, nombre: 'GALLETAS', productos_count: 24, imagen_url: 'https://www.cocinadelirante.com/sites/default/files/images/2023/12/galletas-de-mantequilla-en-sarten.jpg' },
                    { id: 3, nombre: 'CHOCOLATES', productos_count: 21, imagen_url: 'https://www.cestalia.com/blog/wp-content/uploads/2020/06/chocolate-y-cacao.jpg' },
                    { id: 4, nombre: 'CARAMELOS', productos_count: 30, imagen_url: 'https://http2.mlstatic.com/D_NQ_NP_910572-MCO83454443797_042025-O.webp' },
                    { id: 5, nombre: 'GOMITAS', productos_count: 18, imagen_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZms96qmb8d0gTIRUhq5iXedFDHPFNFespQ&s' },
                    { id: 6, nombre: 'CHICLES', productos_count: 12, imagen_url: 'https://m.media-amazon.com/images/I/71OUGG6SvML._SL1236_.jpg' }
                ]);
                setLoading(false);
            });

        // Cargar productos más vendidos
        axios.get('http://127.0.0.1:8000/productos/mas-vendidos')
            .then(response => {
                setBestSellers(response.data.productos || []);
            })
            .catch(err => {
                console.error("Error fetching best sellers:", err);
                // Productos de ejemplo para mostrar en caso de error
                setBestSellers([
                    {
                        id_producto: 1,
                        nombre: "Revolcones",
                        precio: 400,
                        descripcion: "Deliciosas gomitas con sabores ácidos surtidos",
                        imagen_url: "https://www.super.com.co/media/CARAMELO%20MASTICABLE%20REVOLCON(0).png"
                    },
                    {
                        id_producto: 2,
                        nombre: "Chocolatina Jet",
                        precio: 2500,
                        descripcion: "Deliciosa chocolatina de leche",
                        imagen_url: "https://www.nacion.com/resizer/8b27jUm-bPnRNWxelpd3JxLub78=/1440x0/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/gruponacion/E4VXSRDHMVFZVA3XHBNM4R5XHU.jpg"
                    },
                    {
                        id_producto: 3,
                        nombre: "Caramelos de Mantequilla",
                        precio: 5000,
                        descripcion: "Caramelos tradicionales con sabor a mantequilla",
                        imagen_url: "https://sweetys.co/wp-content/uploads/2023/01/caramelo-de-mantequilla-a-granel-en-medellín.jpg"
                    },
                    {
                        id_producto: 4,
                        nombre: "Galletas Oreo",
                        precio: 3500,
                        descripcion: "Galletas de chocolate con relleno de crema",
                        imagen_url: "https://www.tiendasjumbo.co/wp-content/uploads/2023/05/7622300991258_2-1024x1024.jpg"
                    }
                ]);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-5">Cargando categorías...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    const addToCart = (product) => {
        // Función para añadir productos al carrito
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Comprobar si el producto ya existe en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === product.id_producto);
        
        if (existingProductIndex >= 0) {
            // Si el producto ya existe, incrementar cantidad
            cart[existingProductIndex].cantidad += 1;
        } else {
            // Si no existe, añadirlo con cantidad 1
            cart.push({
                id: product.id_producto,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen_url,
                cantidad: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Disparar evento para actualizar contador de carrito
        window.dispatchEvent(new Event('storage'));
        
        alert(`${product.nombre} añadido al carrito`);
    };

    return (
        <div className="home-container">
            {/* Banner a ancho completo */}
            <div className="banner-container">
                <img 
                    src={bannerImage} 
                    alt="El Sabor Que Conquista Tus Antojos" 
                    className="banner-image"
                />
            </div>

            {/* Sección de Categorías */}
            <div className="categories-section">
                <div className="container py-5">
                    <h2 className="categories-title text-center mb-5">PRODUCTOS</h2>
                    
                    <div className="row g-4">
                        {categories.map((category) => (
                            <div className="col-md-6 col-lg-3" key={category.id}>
                                <Link 
                                    to={`/categoria/${category.id}`} 
                                    className="category-card"
                                >
                                    <div className="category-image-container">
                                        <img 
                                            src={category.imagen_url} 
                                            alt={category.nombre}
                                            className="category-image"
                                        />
                                        <div className="category-overlay">
                                            <div className="category-info">
                                                <h3 className="category-name">{category.nombre}</h3>
                                                <p className="category-count">{category.productos_count} PRODUCTOS</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sección de Productos más vendidos */}
            <div className="bestsellers-section">
                <div className="container py-5">
                    <div className="section-header">
                        <h2 className="bestsellers-title text-center mb-4">LOS MÁS VENDIDOS</h2>
                        <p className="text-center mb-5">Descubre los productos favoritos de nuestros clientes</p>
                    </div>
                    
                    <div className="row g-4">
                        {bestSellers.map((product) => (
                            <div className="col-md-6 col-lg-3" key={product.id_producto}>
                                <div className="product-card">
                                    <div className="product-badge">TOP</div>
                                    <Link to={`/productos/${product.id_producto}`} className="product-link">
                                        <div className="product-image-container">
                                            <img 
                                                src={product.imagen_url} 
                                                alt={product.nombre}
                                                className="product-image"
                                            />
                                        </div>
                                    </Link>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.nombre}</h3>
                                        <p className="product-description">{product.descripcion}</p>
                                        <div className="product-bottom">
                                            <span className="product-price">${product.precio.toLocaleString()}</span>
                                            <button 
                                                className="add-to-cart-btn" 
                                                onClick={() => addToCart(product)}
                                            >
                                                <span className="cart-icon">🛒</span> Añadir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-5">
                        <Link to="/productos" className="view-all-btn">
                            Ver todos los productos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;