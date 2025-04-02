
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ArrowLeft, LogOut, BadgeIndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import CartNav from '@/components/CartNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Auctions', path: '/auctions' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
  ];

  // Add scroll detection for better mobile header UI
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const showBackButton = location.pathname !== '/';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
      isScrolled 
        ? "bg-white/95 backdrop-blur-sm shadow-sm" 
        : "glassmorphism border-b border-gray-100"
    )}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center z-20">
          {isMobile && showBackButton ? (
            <button 
              onClick={() => window.history.back()}
              className="mr-2 p-1 rounded-full text-gray-600 hover:text-book-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}
          <Link to="/" className="flex items-center space-x-2">
            <BadgeIndianRupee className="w-6 h-6 text-book-accent" /> {/* Changed to Indian Rupee icon */}
            <span className="text-xl font-medium">Sharebook</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "text-sm font-medium py-2 transition-all duration-200 relative",
                isActive(link.path) 
                  ? "text-book-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-book-accent after:rounded-full"
                  : "text-gray-600 hover:text-book-accent"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Right icons */}
        <div className="flex items-center space-x-4 z-20">
          <button className="p-1 rounded-full text-gray-600 hover:text-book-accent transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Cart Icon */}
          <CartNav />
          
          {/* User menu - Using Sheet for mobile and DropdownMenu for desktop */}
          {isAuthenticated ? (
            isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-full text-gray-600 hover:text-book-accent transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-xl pt-6">
                  <SheetHeader className="text-left pb-4 border-b">
                    <SheetTitle className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-3">
                    <button 
                      className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-md"
                      onClick={() => handleNavigation('/profile')}
                    >
                      Profile
                    </button>
                    {user?.role === 'admin' && (
                      <button 
                        className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-md"
                        onClick={() => handleNavigation('/dashboard')}
                      >
                        Dashboard
                      </button>
                    )}
                    <button 
                      className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-md"
                      onClick={() => handleNavigation('/cart')}
                    >
                      My Cart
                    </button>
                    <button 
                      className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-md"
                      onClick={() => handleNavigation('/sell')}
                    >
                      Sell Books
                    </button>
                    <button 
                      className="w-full text-left py-3 px-2 hover:bg-gray-100 rounded-md text-red-500"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2 inline-block" />
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full text-gray-600 hover:text-book-accent transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-4 z-[100]" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => navigate('/cart')}>
                    My Cart
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/sell')}>
                    Sell Books
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <Link to="/signin" className="p-2 rounded-full text-gray-600 hover:text-book-accent transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
          
          {/* Mobile menu button - replacing dropdown with Sheet for mobile */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="p-2 rounded-full text-gray-600 hover:text-book-accent transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] max-w-sm">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <button 
                      key={link.path} 
                      onClick={() => handleNavigation(link.path)}
                      className={cn(
                        "text-lg font-medium py-3 border-b border-gray-100 flex items-center text-left w-full",
                        isActive(link.path) ? "text-book-accent" : "text-gray-800"
                      )}
                    >
                      {link.name}
                    </button>
                  ))}
                
                  <button 
                    onClick={() => handleNavigation('/cart')}
                    className={cn(
                      "text-lg font-medium py-3 border-b border-gray-100 flex items-center text-left w-full",
                      isActive('/cart') ? "text-book-accent" : "text-gray-800"
                    )}
                  >
                    Cart
                  </button>
                
                  {!isAuthenticated && (
                    <>
                      <button 
                        onClick={() => handleNavigation('/signin')}
                        className="text-lg font-medium py-3 border-b border-gray-100 flex items-center text-left w-full"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => handleNavigation('/signup')}
                        className="text-lg font-medium py-3 border-b border-gray-100 flex items-center text-left w-full"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <button 
              className="md:hidden p-2 rounded-full text-gray-600 hover:text-book-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu - improved for better mobile UX */}
      {isMenuOpen && !isMobile && (
        <div 
          ref={menuRef}
          className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white pt-20 px-6 z-10 animate-fade-in overflow-auto"
        >
          <nav className="flex flex-col space-y-6 mt-6">
            {navLinks.map((link) => (
              <button 
                key={link.path} 
                onClick={() => handleNavigation(link.path)}
                className={cn(
                  "text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full",
                  isActive(link.path) ? "text-book-accent" : "text-gray-800"
                )}
              >
                {link.name}
              </button>
            ))}
            
            <button 
              onClick={() => handleNavigation('/cart')}
              className={cn(
                "text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full",
                isActive('/cart') ? "text-book-accent" : "text-gray-800"
              )}
            >
              Cart
            </button>
            
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('/signin')}
                  className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigation('/signup')}
                  className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full"
                >
                  Profile
                </button>
                <button 
                  onClick={() => handleNavigation('/sell')}
                  className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full"
                >
                  Sell Books
                </button>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => handleNavigation('/dashboard')}
                    className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-left w-full"
                  >
                    Dashboard
                  </button>
                )}
                <button 
                  className="text-lg font-medium py-4 border-b border-gray-100 flex items-center text-red-500 text-left w-full"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
