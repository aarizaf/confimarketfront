import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Carrito.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingOption, setShippingOption] = useState('medellin');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const MIN_ORDER_AMOUNT = 30000;
    const isOrderValid = subtotal >= MIN_ORDER_AMOUNT;

    // Opciones de envío con sus costos
    const shippingOptions = {
        medellin: {
            label: 'Medellín y Bello',
            cost: 6900
        },
        envigado: {
            label: 'Envigado, Itagüí, La Estrella, Sabaneta',
            cost: 6900
        },
        other: {
            label: 'Otras ciudades (El cliente asume el costo de envío)',
            cost: 0
        }
    };

    useEffect(() => {
        // Cargar carrito desde localStorage
        const loadCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(savedCart);
            
            // Calcular subtotal
            const total = savedCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            setSubtotal(total);

            // Establecer costo de envío basado en la opción seleccionada
            setShippingCost(shippingOptions[shippingOption].cost);
        };

        loadCart();
    }, [shippingOption]);

    // Actualizar la cantidad de un producto
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, cantidad: newQuantity };
            }
            return item;
        });

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Recalcular subtotal
        const total = updatedCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        setSubtotal(total);

        // Notificar cambio en el carrito para actualizar el contador en el header
        window.dispatchEvent(new Event('storage'));
    };

    // Eliminar un producto del carrito
    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Recalcular subtotal
        const total = updatedCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        setSubtotal(total);

        // Notificar cambio en el carrito
        window.dispatchEvent(new Event('storage'));
    };

    // Aplicar cupón de descuento
    const applyCoupon = () => {
        if (!couponCode.trim()) {
            setErrorMessage('Por favor ingrese un código de cupón');
            return;
        }

        // Simular verificación de cupón con backend
        // En un caso real, aquí harías una llamada a tu API
        axios.post('http://127.0.0.1:8000/verificar-cupon', { codigo: couponCode })
            .then(response => {
                // Si el cupón es válido
                if (response.data.valid) {
                    setCouponApplied(true);
                    setDiscount(response.data.discount_amount || subtotal * 0.1); // 10% por defecto
                    setErrorMessage('');
                } else {
                    setErrorMessage('Cupón inválido o expirado');
                }
            })
            .catch(err => {
                console.error("Error al verificar cupón:", err);
                
                // Simulación para demo - Asumir un descuento del 10%
                if (couponCode.toLowerCase() === 'confi10') {
                    setCouponApplied(true);
                    setDiscount(subtotal * 0.1);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Cupón inválido o expirado');
                }
            });
    };

    // Actualizar opción de envío
    const handleShippingChange = (option) => {
        setShippingOption(option);
    };

    // Calcular total final
    const calculateTotal = () => {
        return subtotal + shippingCost - discount;
    };

    // Actualizar carrito (Simular actualización de cantidades)
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Carrito actualizado correctamente');
    };

    // Proceder al checkout
    const proceedToCheckout = () => {
        if (!isOrderValid) {
            alert(`El monto mínimo de compra es $${MIN_ORDER_AMOUNT.toLocaleString()}`);
            return;
        }
        
        // Aquí podrías redirigir a la página de checkout/finalizar compra
        // window.location.href = '/checkout';
    };

    return (
        <div className="cart-container container py-5">
            {/* Proceso de compra */}
            <div className="checkout-steps">
                <div className="step active">Carrito de Compras</div>
                <div className="step-arrow"></div>
                <div className="step">Finalizar compra</div>
                <div className="step-arrow"></div>
                <div className="step">Order Complete</div>
            </div>

            {/* Alerta de monto mínimo si aplica */}
            {!isOrderValid && (
                <div className="minimum-order-alert">
                    <i className="alert-icon">⚠️</i>
                    <span>Para realizar tu pedido la compra debe ser de mínimo ${MIN_ORDER_AMOUNT.toLocaleString()}.</span>
                </div>
            )}

            {/* Contenido principal */}
            <div className="row mt-4">
                {/* Tabla de productos */}
                <div className="col-lg-8">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <h3>Tu carrito está vacío</h3>
                            <p>Parece que aún no has añadido productos a tu carrito</p>
                            <Link to="/productos" className="continue-shopping">
                                Continuar comprando
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-table">
                                <div className="cart-header">
                                    <div className="header-product">PRODUCTO</div>
                                    <div className="header-price">PRECIO</div>
                                    <div className="header-quantity">CANTIDAD</div>
                                    <div className="header-subtotal">SUBTOTAL</div>
                                </div>
                                
                                {cart.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="item-product">
                                            <button 
                                                className="remove-item" 
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Eliminar producto"
                                            >
                                                ×
                                            </button>
                                            <div className="product-image">
                                                <img src={item.imagen} alt={item.nombre} />
                                            </div>
                                            <div className="product-details">
                                                <h4>{item.nombre}</h4>
                                            </div>
                                        </div>
                                        <div className="item-price">
                                            ${item.precio.toLocaleString()}
                                        </div>
                                        <div className="item-quantity">
                                            <div className="quantity-control">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                    disabled={item.cantidad <= 1}
                                                >
                                                    −
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={item.cantidad} 
                                                    readOnly 
                                                />
                                                <button onClick={() => updateQuantity(item.id, item.cantidad + 1)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="item-subtotal">
                                            ${(item.precio * item.cantidad).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cupón y botón actualizar */}
                            <div className="coupon-row">
                                <div className="coupon-input">
                                    <input 
                                        type="text" 
                                        placeholder="Código de cupón" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button className="apply-coupon" onClick={applyCoupon}>
                                        APLICAR CUPÓN
                                    </button>
                                    {errorMessage && <p className="coupon-error">{errorMessage}</p>}
                                </div>
                                <button className="update-cart" onClick={updateCart}>
                                    ACTUALIZAR CARRITO
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Resumen del carrito */}
                <div className="col-lg-4">
                    <div className="cart-summary">
                        <h3 className="summary-title">TOTALES DEL CARRITO</h3>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        
                        {couponApplied && (
                            <div className="summary-row discount">
                                <span>Descuento</span>
                                <span>-${discount.toLocaleString()}</span>
                            </div>
                        )}

                        <div className="shipping-options">
                            <h4>Envío</h4>
                            
                            <div className="shipping-option">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="shipping" 
                                        checked={shippingOption === 'medellin'}
                                        onChange={() => handleShippingChange('medellin')}
                                    />
                                    <span className="option-text">
                                        {shippingOptions.medellin.label}: ${shippingOptions.medellin.cost.toLocaleString()}
                                    </span>
                                </label>
                            </div>
                            
                            <div className="shipping-option">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="shipping"
                                        checked={shippingOption === 'envigado'}
                                        onChange={() => handleShippingChange('envigado')}
                                    />
                                    <span className="option-text">
                                        {shippingOptions.envigado.label}: ${shippingOptions.envigado.cost.toLocaleString()}
                                    </span>
                                </label>
                            </div>
                            
                            <div className="shipping-option">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="shipping"
                                        checked={shippingOption === 'other'}
                                        onChange={() => handleShippingChange('other')}
                                    />
                                    <span className="option-text">
                                        {shippingOptions.other.label}
                                    </span>
                                </label>
                            </div>
                            
                            <div className="shipping-destination">
                                Enviar a <strong>Antioquia</strong>
                            </div>
                        </div>
                        
                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-amount">${calculateTotal().toLocaleString()}</span>
                        </div>
                        
                        <button 
                            className={`checkout-button ${!isOrderValid ? 'disabled' : ''}`} 
                            onClick={proceedToCheckout}
                            disabled={!isOrderValid}
                        >
                            FINALIZAR COMPRA <span className="arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;