'use client'

import React from "react"
import { createContext,useContext,useEffect,useState } from "react"

const CartContext = createContext();

export const CartProvider =({children}) =>{
    const [cartitems,setcartitems]=useState([
        {
          "productid": "123",
          "name": "Wireless Mouse",
          "price": 499,
          "quantity": 2
        },
        {
          "productid": "456",
          "name": "Gaming Keyboard",
          "price": 1599,
          "quantity": 1
        }
      
      ]);

    useEffect(()=>{
        const storedItems = localStorage.getItem('Cart');

        if(storedItems){
            setcartitems(JSON.parse(storedItems));
        }
    },[]);

    useEffect(()=>{
        localStorage.setItem('Cart',JSON.stringify(cartitems));
    },[cartitems]);


    //add items

    const addToCart = (product)=>{
        setcartitems((previtems)=>{
            const exist = previtems.find((item)=>item.productid === product.productid);
            if(exist){
                return previtems.map((item)=>{
                    item.productid === product.productid?
                    {...item,quantity:item.quantity+1}:item
             } );
            }else{
                return [...previtems,{...product,quantity:1}];
            }
        });
    }

    //remove cart items;

    const removeFromCart=(productId)=>{
        setcartitems((previtems)=>{
            return previtems.filter((item)=>{
                if(item.productid !== productId){
                    return item;
                }
            });
        });
    }

    //clear cart;

    const clearCart = ()=>{
        setcartitems([]);
    }

    //update quantity;

    const updateQuantity=(productId,quantity)=>{
        if(quantity<=0){
            return removeFromCart(productId);
        }else{
            setcartitems((previtems)=>{
                previtems.map((item)=>{
                    item.productid === productId ? {...item,quantity}:item;
                });
            });
        }
        
    }


    return(
        <CartContext.Provider 
        value={{cartitems, addToCart, removeFromCart, clearCart, updateQuantity}}>
            {children}
        </CartContext.Provider>
    );



};
//custom hook;
export const useCart =()=>useContext(CartContext);