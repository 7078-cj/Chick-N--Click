import { Modal } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from './AppButton';
import AuthContext from '../Contexts/AuthContext';

function AddToCart({ setCartOpened, cartOpened, quantity, setQuantity, handleAddToCart, food, close }) {
    const url = import.meta.env.VITE_API_URL;
    const { token } = useContext(AuthContext);

    const [sides, setSides] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch sides
    const fetchSides = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${url}/api/sides`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch sides");
            const data = await res.json();
            setSides(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch drinks
    const fetchDrinks = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${url}/api/drinks`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch drinks");
            const data = await res.json();
            setDrinks(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch sides and drinks on mount
    useEffect(() => {
        fetchDrinks();
        fetchSides();
    }, []);

    return (
        <Modal
            opened={cartOpened}
            onClose={() => setCartOpened(false)}
            centered
            size={"100%"}
        >
            <div className='h-[80vh] flex flex-row w-full items-center justify-center'>
                
                {/* Left Section */}
                <div className='w-[30%] flex flex-col justify-between h-full p-4'>
                    <h1 className='hoc_font text-5xl pr-[30px] text-amber-600 font-extrabold py-10'>
                        {food.food_name}
                    </h1>

                    <div>
                        <h4 className='text-amber-700 text-wrap'>{food.description}</h4>

                        {food.categories?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {food.categories.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className="text-xs bg-amber-100 text-gray-700 px-2 py-1 rounded-md"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div className='flex flex-row w-[50%]'>
                        <div className="bg-yellow-300 px-2 py-1 rounded-l-lg w-[15%] flex justify-center">
                            <button
                                className="text-lg font-bold text-orange-700 hover:text-orange-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setQuantity(prev => prev + 1);
                                }}
                            >+</button>
                        </div>

                        <div className="font-bold w-[20%] flex items-center justify-center">{quantity}</div>

                        <div className="bg-yellow-300 px-2 py-1 rounded-r-lg w-[15%] flex justify-center">
                            <button
                                className="text-lg font-bold text-orange-700 hover:text-orange-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (quantity > 1) setQuantity(prev => prev - 1);
                                }}
                            >-</button>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <AppButton
                        useCase="checkout"
                        fullWidth
                        className="mt-4"
                        onClick={() => handleAddToCart(food, quantity, close)}
                    >
                        Confirm Add
                    </AppButton>
                </div>

                {/* Image Section */}
                <div className='w-[40%] flex flex-col justify-center items-center'>
                    <img
                        src={food.thumbnail ? `${url}/storage/${food.thumbnail}` : "https://via.placeholder.com/320x200?text=No+Image"}
                        alt={food.food_name}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>

                {/* Price Section */}
                <div className='w-[30%] h-full p-4'>
                    <h1 className='w-full text-right hoc_font text-5xl pr-[30px] text-amber-500 font-extrabold '>
                        P{food.price}
                    </h1>
                </div>
            </div>
        </Modal>
    );
}

export default AddToCart;
