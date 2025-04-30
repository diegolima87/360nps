
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import { toast } from "sonner";

export function NavBar() {
  const { user, logout } = useSupabaseAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-xl font-bold text-gradient">NPS360</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
              <Link
                to="/survey-create"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/survey-create" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Nova Pesquisa
                </span>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
              <div className="ml-4 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                {user.name}
              </div>
            </>
          ) : (
            location.pathname !== "/login" && location.pathname !== "/register" ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient hover:opacity-90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar
                  </Button>
                </Link>
              </>
            ) : null
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b pb-4">
          <nav className="flex flex-col space-y-3 px-6">
            <Link
              to="/"
              className="flex items-center py-2 text-base font-medium"
              onClick={toggleMobileMenu}
            >
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center py-2 text-base font-medium"
                  onClick={toggleMobileMenu}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/survey-create"
                  className="flex items-center py-2 text-base font-medium"
                  onClick={toggleMobileMenu}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Pesquisa
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center py-2 text-base font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center py-2 text-base font-medium"
                  onClick={toggleMobileMenu}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center py-2 text-base font-medium"
                  onClick={toggleMobileMenu}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
