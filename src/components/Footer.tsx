import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const footerNavigation = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
    categories: [
        { name: 'Technology', href: '/category/technology' },
        { name: 'Business', href: '/category/business' },
        { name: 'Sports', href: '/category/sports' },
        { name: 'Entertainment', href: '/category/entertainment' },
    ],
    social: [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">N</span>
                            </div>
                            <span className="font-bold text-xl">NewsPortal</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your trusted source for the latest news and stories from around the world.
                        </p>
                        <div className="flex gap-2">
                            {footerNavigation.social.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="p-2 rounded-md bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                                        aria-label={item.name}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerNavigation.company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {footerNavigation.categories.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to get the latest news delivered to your inbox.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="submit"
                                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                aria-label="Subscribe"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} NewsPortal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
