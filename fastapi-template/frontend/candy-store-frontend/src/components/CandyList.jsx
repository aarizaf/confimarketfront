import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CandyList = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://127.0.0.1:8080/productos')
            .then(response => {
                setProductos(response.data.productos);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching products');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Our Products</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.nombre}>
                        <strong>{producto.nombre}</strong>: {producto.descripcion} - ${producto.precio.toFixed(2)}
                        <br />
                        <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100px', height: '100px' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CandyList;