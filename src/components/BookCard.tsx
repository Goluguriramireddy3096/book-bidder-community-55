
import { Link } from 'react-router-dom';
import { Clock, ArrowUp, Award, ShoppingCart } from 'lucide-react';
import { Book } from '@/lib/data';
import { cn } from '@/lib/utils';
import { BookService } from '@/lib/bookService';
import { useCart } from '@/contexts/CartContext';

interface BookCardProps {
  book: Book;
  className?: string;
  animationDelay?: number;
}

const BookCard = ({ book, className, animationDelay = 0 }: BookCardProps) => {
  const { 
    id, 
    title, 
    author, 
    coverImage, 
    price, 
    isAuction, 
    auctionData,
    condition 
  } = book;
  
  const { addToCart } = useCart();
  const formattedPrice = BookService.formatPrice(isAuction ? auctionData?.currentBid || 0 : price);

  const timeLeft = () => {
    if (!auctionData) return '';
    
    const end = new Date(auctionData.endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    // If auction ended
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m left`;
    
    return `${minutes}m left`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  return (
    <Link 
      to={`/books/${id}`} 
      className={cn(
        'book-card group relative block h-full bg-white rounded-md overflow-hidden shadow-smooth transition-all duration-500',
        'opacity-0 transform',
        'hover:shadow-book',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="relative pb-[130%] overflow-hidden">
          <img 
            src={coverImage} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {isAuction && (
            <div className="absolute top-3 left-3 bg-book-bidding text-white text-xs font-medium px-2 py-1 rounded-full">
              Auction
            </div>
          )}
          
          {condition && (
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
              {condition}
            </div>
          )}

          {!isAuction && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 bg-book-accent text-white p-2 rounded-full transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col p-4 flex-grow">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">by {author}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">
                {isAuction ? 'Current bid' : 'Price'}
              </span>
              <span className={cn(
                "font-medium",
                isAuction ? "text-book-bidding" : "text-gray-900"
              )}>
                {formattedPrice}
              </span>
            </div>
            
            {isAuction && auctionData && (
              <div className="flex items-center space-x-2">
                {auctionData.highDemand && (
                  <div className="flex items-center text-amber-500">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Hot</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">{timeLeft()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
