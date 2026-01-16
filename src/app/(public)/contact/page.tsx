'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate form submission
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="py-12">
            <div className="container max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Contact Us</h1>

                <p className="text-xl text-muted-foreground mb-12">
                    Have a question, comment, or news tip? We&apos;d love to hear from you. Fill out the form below
                    and we&apos;ll get back to you as soon as possible.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Your Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="General Inquiry"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Your message..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <p className="text-green-600 dark:text-green-400 text-sm">
                                    ✓ Your message has been sent successfully! We&apos;ll get back to you soon.
                                </p>
                            )}

                            {status === 'error' && (
                                <p className="text-red-600 dark:text-red-400 text-sm">
                                    ✗ Something went wrong. Please try again later.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-1">Email</h4>
                                    <a
                                        href="mailto:contact@sohandaily.com"
                                        className="text-primary hover:underline"
                                    >
                                        contact@sohandaily.com
                                    </a>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-1">News Tips</h4>
                                    <a href="mailto:tips@sohandaily.com" className="text-primary hover:underline">
                                        tips@sohandaily.com
                                    </a>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-1">Advertising</h4>
                                    <a href="mailto:ads@sohandaily.com" className="text-primary hover:underline">
                                        ads@sohandaily.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    Facebook
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    Twitter
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    Instagram
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    LinkedIn
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                            <p className="text-muted-foreground">
                                Monday - Friday: 9:00 AM - 6:00 PM
                                <br />
                                Saturday - Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
