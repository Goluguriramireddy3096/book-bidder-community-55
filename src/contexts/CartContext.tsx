
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Book } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  isBookInCart: (bookId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sharebook-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sharebook-cart", JSON.stringify(items));
  }, [items]);
  
  const addToCart = (book: Book) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.book.id === book.id);
      
      if (existingItem) {
        // Increment quantity if already in cart
        return prevItems.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { book, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart`,
      duration: 2000,
    });
  };
  
  const removeFromCart = (bookId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.book.id === bookId);
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.book.title} has been removed from your cart`,
          duration: 2000,
        });
      }
      return prevItems.filter(item => item.book.id !== bookId);
    });
  };
  
  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.book.id === bookId 
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 2000,
    });
  };
  
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.book.isAuction 
        ? (item.book.auctionData?.currentBid || 0) 
        : item.book.price;
      return total + price * item.quantity;
    }, 0);
  };
  
  const isBookInCart = (bookId: string) => {
    return items.some(item => item.book.id === bookId);
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getItemCount, 
        getTotalPrice,
        isBookInCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
