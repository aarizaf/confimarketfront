import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'; // Importa useHistory
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams(); // Obtener el id del producto desde la URL
    const history = useHistory(); // Hook para redirigir al usuario
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch product details from the backend
        axios.get(`http://127.0.0.1:8085/productos/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching product details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Cargando información del producto...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    if (!product) {
        return <div className="text-center mt-5 text-danger">Producto no encontrado</div>;
    }

    const handleAddToCart = () => {
        // Obtener el carrito actual desde localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.find((item) => item.id_producto === product.id_producto);

        if (existingProduct) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            existingProduct.cantidad += quantity;
        } else {
            // Si el producto no está en el carrito, agrégalo
            cart.push({
                id_producto: product.id_producto,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: quantity,
                imagen_url: product.imagen_url || null,
            });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Redirigir al carrito
        history.push('/carrito');
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12 text-center">
                    <h2 className="text-dark">{product.nombre}</h2>
                </div>
                <div className="col-md-6 mx-auto">
                    <img
                        src={product.imagen ? `data:image/jpeg;base64,${product.imagen}` : product.imagen_url}
                        className="img-fluid rounded mt-3"
                        alt={product.nombre}
                        style={{ objectFit: 'cover', maxHeight: '400px' }}
                    />
                </div>
                <div className="col-md-12 mt-4">
                    <p className="text-muted">{product.descripcion}</p>
                    <p className="text-primary font-weight-bold">${product.precio.toFixed(2)}</p>
                    <div className="d-flex align-items-center justify-content-center">
                        <input
                            type="number"
                            className="form-control w-25 me-3"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button className="btn btn-primary" onClick={handleAddToCart}>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;