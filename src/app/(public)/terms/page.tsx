import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service - NewsPortal',
    description: 'Terms and conditions for using NewsPortal',
};

export default function TermsPage() {
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
                            <FileText className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground text-lg mb-8">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground">
                                    By accessing and using NewsPortal, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                                <p className="text-muted-foreground mb-4">
                                    Permission is granted to temporarily access the materials (information or software) on NewsPortal for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose</li>
                                    <li>Attempt to decompile or reverse engineer any software</li>
                                    <li>Remove any copyright or other proprietary notations</li>
                                    <li>Transfer the materials to another person</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. User Content</h2>
                                <p className="text-muted-foreground">
                                    Our service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content you submit and must ensure it does not violate any laws or infringe on others' rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Disclaimer</h2>
                                <p className="text-muted-foreground">
                                    The materials on NewsPortal are provided on an &apos;as is&apos; basis. NewsPortal makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Limitations</h2>
                                <p className="text-muted-foreground">
                                    In no event shall NewsPortal or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NewsPortal.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Accuracy of Materials</h2>
                                <p className="text-muted-foreground">
                                    The materials appearing on NewsPortal could include technical, typographical, or photographic errors. NewsPortal does not warrant that any of the materials on its website are accurate, complete or current.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">7. Links</h2>
                                <p className="text-muted-foreground">
                                    NewsPortal has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NewsPortal.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">8. Modifications</h2>
                                <p className="text-muted-foreground">
                                    NewsPortal may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about these Terms of Service, please contact us at{' '}
                                    <a href="mailto:legal@newsportal.com" className="text-primary hover:underline">
                                        legal@newsportal.com
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
