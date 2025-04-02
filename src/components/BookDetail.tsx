
import { Book } from '@/lib/data';
import { Check, Award, Clock, AlertCircle, ShoppingCart } from 'lucide-react';
import LiveBidInterface from './LiveBidInterface';
import { BookService } from '@/lib/bookService';
import { useCart } from '@/contexts/CartContext';

interface BookDetailProps {
  book: Book;
}

const BookDetail = ({ book }: BookDetailProps) => {
  const { 
    title, 
    author, 
    coverImage, 
    description,
    price,
    condition,
    genre,
    language,
    isAuction,
    auctionData,
    seller,
    publishedDate,
    isbn,
    pageCount,
    views
  } = book;
  
  const { addToCart, isBookInCart } = useCart();
  const alreadyInCart = isBookInCart(book.id);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formattedPrice = BookService.formatPrice(isAuction ? auctionData?.currentBid || 0 : price);
  
  const timeLeft = () => {
    if (!auctionData) return '';
    
    const end = new Date(auctionData.endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Auction ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days > 0 ? `${days} days, ` : ''}${hours} hours, ${minutes} minutes`;
  };

  const handleAddToCart = () => {
    if (!alreadyInCart && !isAuction) {
      addToCart(book);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left column - Image */}
        <div className="relative">
          <div className="relative bg-book-paper rounded-lg overflow-hidden shadow-book aspect-[3/4]">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Seller info */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-smooth">
            <div className="flex items-center space-x-3">
              <img 
                src={seller.avatar} 
                alt={seller.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Listed by</p>
                <p className="font-medium">{seller.name}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(seller.rating) ? "text-amber-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
              <span className="ml-1 text-sm text-gray-700">{seller.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {genre.map(g => (
              <span key={g} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                {g}
              </span>
            ))}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              {condition}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-gray-600 mb-6">by {author}</p>
          
          <div className="mb-8 prose prose-gray max-w-none">
            <p>{description}</p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">ISBN:</span>
                <span>{isbn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span>{language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Published:</span>
                <span>{formatDate(publishedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Page Count:</span>
                <span>{pageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Views:</span>
                <span>{views}</span>
              </div>
            </div>
          </div>
          
          {/* Price or Auction section */}
          <div className="p-5 rounded-lg bg-gray-50 border border-gray-100">
            {isAuction && auctionData ? (
              <LiveBidInterface book={book} />
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
                  <p className="flex items-center text-green-600 text-sm mt-1">
                    <Check className="w-4 h-4 mr-1" />
                    In Stock
                  </p>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className={`px-6 py-3 rounded-md flex items-center transition-colors ${
                    alreadyInCart 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-book-accent text-white hover:bg-book-accent/90'
                  }`}
                >
                  {alreadyInCart ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Shipping notice */}
          <div className="mt-6 flex items-start space-x-3 text-gray-600">
            <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              This {isAuction ? 'auction' : 'item'} includes free shipping. Please allow 3-5 business days for delivery after {isAuction ? 'auction end' : 'purchase'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
