
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

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
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-book-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartNav;
