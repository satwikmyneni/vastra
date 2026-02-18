import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, Menu, X, ChevronDown } from "lucide-react";
import { DbCategory } from "@/types/database";
import { useFavorites } from "@/hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  categories: DbCategory[];
}

const Header = ({ categories }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { count } = useFavorites(); // ⭐ favorites hook connected

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">
              Vastra
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Collections <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-background border border-border rounded-lg shadow-elegant p-6 grid grid-cols-2 gap-4"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors group"
                        onClick={() => setMegaMenuOpen(false)}
                      >
                        {cat.image && (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/category/bridal"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Bridal
            </Link>

            <Link
              to="/category/sarees"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              New Arrivals
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* ⭐ Favorites with badge */}
            <Link
              to="/favorites"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <Heart className="h-5 w-5" />

              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search for sarees, lehengas, gowns..."
                className="w-full px-4 py-3 bg-secondary rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-background border-t border-border"
          >
            <nav className="flex flex-col p-4 gap-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 text-foreground font-medium hover:bg-secondary rounded-md"
              >
                Home
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 text-foreground hover:bg-secondary rounded-md"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
