import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );
  const [koiInCart, setKoiInCart] = useState(false);
  const [koiInPond, setKoiInPond] = useState(false);
  const [koi, setKoi] = useState(0);
  const [pond, setPond] = useState(0);
  const [result, setResult] = useState(null);
  const [value , setValue] = useState({});
  const addToCart = (item) => {
    const isItemInCart = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );
    const isKoi = item.koiName;
    const isPond = item.shape;
   
    const koiInCart = cartItems.some((item) => item.koiName);
    const pondInCart = cartItems.some((item) => item.shape);
   
    if (cartItems.length <= 2) {
      if (isPond && pondInCart) {
        toast.error("just add one pond");
        return;
      }
      if (isKoi && koiInCart) {
        toast.error("just add one koi ");
        return;
      }
       isKoi && toast.success("The Koi was added  Assess Suitability");
     
        isPond && toast.success("The Pond was added Assess Suitability");
     

      if (isItemInCart) {
    
        console.log("product was selected");
        return;
      }
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (item) => {
    if (item.koiName) {
      console.log(" remove koi");
      setKoiInCart(false);
    } else {
      console.log("remove pond");
      setKoiInPond(false);
    }

    setCartItems(cartItems.filter((cartItems) => cartItems._id !== item._id));
  };

  const clearCart = () => {
    setCartItems([]);
    setResult(null);
    setKoi(0); 
    setPond(0);
    
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleMutual = async () => {
    try {
      const res = await axios.post("http://localhost:8081/v1/user/mutual", {
        elementID_koi: koi,
        elementID_pond: pond,
        elementID_user: value.elementID,
      });
      console.log(res.data);
    ;
      setResult(res.data.success)  
      res.data.success === 1 ? toast.success(res.data.message) :  toast.error(res.data.message)
      console.log(result);
    } catch (err) {
      console.log("Error at Cart Context "+err);
      toast.error(err.response.message)
      
      console.log(err);
      
    }
  };
  // lưu cart vô storage mỗi lần bị thay đổi 
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  useEffect(() => {
    cartItems.map((items) => {
      console.log(items);

      items.koiName && setKoi(items.elementID);
      items.shape && setPond(items.elementID);
    });
    setValue(JSON.parse(localStorage.getItem("elementUser")));
    console.log(koi, pond);
    // handleMutual(koi, pond);
  }, [cartItems]);
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        result ,
        handleMutual
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
