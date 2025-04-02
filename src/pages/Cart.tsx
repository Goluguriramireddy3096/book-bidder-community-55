
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { BookService } from "@/lib/bookService";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some books to your cart first",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing checkout
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: "Your books will be delivered soon",
        duration: 3000,
      });
      clearCart();
      setIsProcessing(false);
      navigate("/");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-book-paper">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-smooth p-8 flex flex-col items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 text-center">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Button onClick={() => navigate("/books")}>Browse Books</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-smooth overflow-hidden">
                {/* Cart Item Headers - Hide on mobile */}
                {!isMobile && (
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
                    <div className="col-span-6">Book</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total</div>
                  </div>
                )}
                
                {/* Cart Items */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.book.id} className={cn(
                      "grid gap-4 p-4",
                      isMobile ? "grid-cols-1" : "grid-cols-12 items-center"
                    )}>
                      {/* Mobile: Book details as a block */}
                      {isMobile ? (
                        <div className="flex gap-4">
                          <div className="w-24 h-32 flex-shrink-0">
                            <img 
                              src={item.book.coverImage} 
                              alt={item.book.title} 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.book.title}</h3>
                            <p className="text-sm text-gray-500 mb-1">by {item.book.author}</p>
                            <p className="text-sm text-gray-500 mb-1">{item.book.condition}</p>
                            <p className="font-medium text-book-accent mb-2">
                              {BookService.formatPrice(item.book.isAuction 
                                ? (item.book.auctionData?.currentBid || 0) 
                                : item.book.price)
                              }
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                  className="p-2 text-gray-500 hover:text-gray-700"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 min-w-[30px] text-center">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                  className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => removeFromCart(item.book.id)}
                                className="p-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Desktop: Grid layout */
                        <>
                          <div className="col-span-6 flex gap-4 items-center">
                            <div className="w-16 h-24 flex-shrink-0">
                              <img 
                                src={item.book.coverImage} 
                                alt={item.book.title} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.book.title}</h3>
                              <p className="text-sm text-gray-500">by {item.book.author}</p>
                              <p className="text-sm text-gray-500">{item.book.condition}</p>
                              <button 
                                onClick={() => removeFromCart(item.book.id)}
                                className="text-sm text-red-500 hover:text-red-700 mt-1 flex items-center"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="col-span-2 text-center">
                            {BookService.formatPrice(item.book.isAuction 
                              ? (item.book.auctionData?.currentBid || 0) 
                              : item.book.price)
                            }
                          </div>
                          
                          <div className="col-span-2">
                            <div className="flex items-center justify-center border rounded-md w-min mx-auto">
                              <button 
                                onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="col-span-2 text-center font-medium">
                            {BookService.formatPrice(
                              (item.book.isAuction 
                                ? (item.book.auctionData?.currentBid || 0) 
                                : item.book.price) * item.quantity
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/books")}
                  className="text-gray-600"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-smooth p-6 h-fit">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({items.length}):</span>
                  <span>{BookService.formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-medium">{BookService.formatPrice(getTotalPrice())}</span>
                </div>
              </div>
              
              <Button 
                className="w-full py-6"
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? "Processing..." : "Checkout"}
              </Button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Secure checkout powered by Sharebook
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
