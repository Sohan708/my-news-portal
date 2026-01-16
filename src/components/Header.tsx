'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled
                ? 'glass shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div className={`absolute inset-0 bg-background/80 transition-opacity duration-500 -z-10 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="container">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="text-2xl font-bold font-serif relative">
                            <span className="text-primary group-hover:text-primary/80 transition-colors">Sohan</span>
                            <span className="text-foreground group-hover:text-foreground/80 transition-colors">Daily</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {['Home', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`}
                                className="relative font-medium hover:text-primary transition-colors py-1 group/link"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover/link:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
                        </button>

                        <Link
                            href="/search"
                            className="p-2.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-95"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-border/50 animate-slide-up bg-background/95 backdrop-blur-xl absolute top-full left-0 w-full px-4 shadow-xl rounded-b-2xl border-b mb-4">
                        <div className="flex flex-col space-y-2">
                            {['Home', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment'].map((item, idx) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`}
                                    className="hover:text-primary hover:bg-muted/50 rounded-lg px-4 py-3 transition-colors text-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
