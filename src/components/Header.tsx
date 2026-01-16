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
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? 'bg-background/95 backdrop-blur-sm shadow-md border-b border-border'
                    : 'bg-background'
                }`}
        >
            <div className="container">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold font-serif">
                            <span className="text-primary">Sohan</span>{' '}
                            <span className="text-foreground">Daily</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/category/politics" className="hover:text-primary transition-colors">
                            Politics
                        </Link>
                        <Link href="/category/business" className="hover:text-primary transition-colors">
                            Business
                        </Link>
                        <Link href="/category/technology" className="hover:text-primary transition-colors">
                            Technology
                        </Link>
                        <Link href="/category/sports" className="hover:text-primary transition-colors">
                            Sports
                        </Link>
                        <Link href="/category/entertainment" className="hover:text-primary transition-colors">
                            Entertainment
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link
                            href="/search"
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/category/politics"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Politics
                            </Link>
                            <Link
                                href="/category/business"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Business
                            </Link>
                            <Link
                                href="/category/technology"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Technology
                            </Link>
                            <Link
                                href="/category/sports"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sports
                            </Link>
                            <Link
                                href="/category/entertainment"
                                className="hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Entertainment
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
