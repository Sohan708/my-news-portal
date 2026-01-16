import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy - NewsPortal',
    description: 'Our privacy policy and how we handle your data',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen">
            <div className="container py-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <div className="container py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary rounded-xl">
                            <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground text-lg mb-8">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                                <p className="text-muted-foreground mb-4">
                                    We collect information you provide directly to us when you create an account, subscribe to our newsletter, or contact us. This may include:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Name and email address</li>
                                    <li>Reading preferences and behavior</li>
                                    <li>Device and browser information</li>
                                    <li>IP address and location data</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Send you newsletters and updates</li>
                                    <li>Respond to your comments and questions</li>
                                    <li>Analyze usage patterns and trends</li>
                                    <li>Detect and prevent fraud and abuse</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                                <p className="text-muted-foreground">
                                    We do not sell your personal information. We may share your information with third-party service providers who help us operate our website and provide services to you, such as analytics providers and email service providers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
                                <p className="text-muted-foreground">
                                    We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                                <p className="text-muted-foreground">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                                <p className="text-muted-foreground mb-4">
                                    You have the right to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Object to processing of your data</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about this Privacy Policy, please contact us at{' '}
                                    <a href="mailto:privacy@newsportal.com" className="text-primary hover:underline">
                                        privacy@newsportal.com
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
