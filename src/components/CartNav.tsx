
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

interface CartNavProps {
  className?: string;
}

const CartNav = ({ className }: CartNavProps) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  
  return (
    <Link 
      to="/cart" 
      className={cn(
        "p-1 rounded-full text-gray-600 hover:text-book-accent transition-colors relative",
        className
      )}
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1 bg-book-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </motion.span>
      )}
    </Link>
  );
};

export default CartNav;
