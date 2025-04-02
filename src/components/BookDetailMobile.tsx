
import { useRef } from 'react';
import { Book } from '@/lib/data';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { 
  Book as BookIcon, 
  Award, 
  Calendar, 
  Hash, 
  Languages, 
  Eye, 
  User, 
  Star, 
  ArrowRight,
  ChevronDown,
  ShoppingCart,
  Check 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LiveBidInterface from './LiveBidInterface';
import { BookService } from '@/lib/bookService';
import { useCart } from '@/contexts/CartContext';

interface BookDetailMobileProps {
  book: Book;
  onNavigateBack: () => void;
}

const BookDetailMobile = ({ book, onNavigateBack }: BookDetailMobileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { addToCart, isBookInCart } = useCart();
  
  // Add swipe to go back functionality
  useTouchGestures(containerRef, {
    onSwipeRight: onNavigateBack,
    threshold: 75
  });
  
  const timeLeft = () => {
    if (!book.auctionData) return '';
    
    const end = new Date(book.auctionData.endsAt);
    const now = new Date();
    
    if (end <= now) return 'Auction ended';
    
    return `Ends ${formatDistanceToNow(end, { addSuffix: true })}`;
  };

  const handleAddToCart = () => {
    if (!book.isAuction && !alreadyInCart) {
      addToCart(book);
    }
  };

  const alreadyInCart = isBookInCart(book.id);
  
  return (
    <div 
      ref={containerRef} 
      className="flex flex-col w-full animate-fade-in"
    >
      {/* Book cover image */}
      <div className="w-full aspect-[3/4] relative">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
        
        {book.isAuction && book.auctionData && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Current bid</p>
                <p className="text-xl font-bold">{BookService.formatPrice(book.auctionData.currentBid)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{book.auctionData.bidsCount} bids</p>
                <p className="text-sm text-yellow-300">{timeLeft()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Book details */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
        <p className="text-gray-700 mb-3">by {book.author}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {book.genre.map(g => (
            <span 
              key={g} 
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        
        <p className="text-gray-600 mb-6">{book.description}</p>
        
        {/* Book metadata */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <BookIcon className="w-4 h-4 text-book-accent" />
              <span className="text-sm text-gray-600">Condition</span>
            </div>
            <span className="font-medium">{book.condition}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-book-accent" />
              <span className="text-sm text-gray-600">Published</span>
            </div>
            <span className="font-medium">{book.publishedDate}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-book-accent" />
              <span className="text-sm text-gray-600">ISBN</span>
            </div>
            <span className="font-medium">{book.isbn}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-book-accent" />
              <span className="text-sm text-gray-600">Language</span>
            </div>
            <span className="font-medium">{book.language}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-book-accent" />
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <span className="font-medium">{book.views}</span>
          </div>
        </div>
        
        {/* Auction or Buy Section */}
        {book.isAuction ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
            <LiveBidInterface book={book} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              className={`w-full flex items-center justify-center ${alreadyInCart ? 'bg-green-600 hover:bg-green-700' : 'bg-book-accent hover:bg-book-accent/90'}`}
              onClick={handleAddToCart}
              disabled={alreadyInCart}
            >
              {alreadyInCart ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Link to="/cart">
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
          </div>
        )}
        
        {/* Seller info */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Seller</h3>
          <div className="flex items-center space-x-3">
            <img 
              src={book.seller.avatar} 
              alt={book.seller.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{book.seller.name}</p>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">{book.seller.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailMobile;
