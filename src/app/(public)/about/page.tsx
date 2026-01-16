import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Sohan Daily News',
    description: 'Learn more about Sohan Daily News, your trusted source for breaking news and analysis.',
};

export default function AboutPage() {
    return (
        <div className="py-12">
            <div className="container max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">About Us</h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl text-muted-foreground mb-8">
                        Welcome to Sohan Daily News - your trusted source for breaking news, in-depth analysis, and
                        compelling stories from around the world.
                    </p>

                    <h2>Our Mission</h2>
                    <p>
                        At Sohan Daily News, we are committed to delivering accurate, timely, and unbiased news to our
                        readers. Our mission is to inform, educate, and empower our audience with the knowledge they
                        need to make informed decisions about the world around them.
                    </p>

                    <h2>What We Cover</h2>
                    <p>Our comprehensive coverage includes:</p>
                    <ul>
                        <li>
                            <strong>Politics:</strong> Latest political developments, election coverage, and government
                            policy analysis
                        </li>
                        <li>
                            <strong>Business:</strong> Market trends, economic news, and corporate developments
                        </li>
                        <li>
                            <strong>Technology:</strong> Innovation, startups, and the latest tech trends
                        </li>
                        <li>
                            <strong>Sports:</strong> Comprehensive sports coverage from around the globe
                        </li>
                        <li>
                            <strong>Entertainment:</strong> Movies, music, celebrity news, and cultural events
                        </li>
                        <li>
                            <strong>Health & Science:</strong> Medical breakthroughs, scientific discoveries, and
                            wellness tips
                        </li>
                        <li>
                            <strong>World News:</strong> International affairs and global perspectives
                        </li>
                    </ul>

                    <h2>Our Values</h2>
                    <p>
                        <strong>Accuracy:</strong> We fact-check our stories and strive for the highest standards of
                        journalistic integrity.
                    </p>
                    <p>
                        <strong>Independence:</strong> We maintain editorial independence and report without bias or
                        external influence.
                    </p>
                    <p>
                        <strong>Transparency:</strong> We are open about our sources and methodologies, and we correct
                        our mistakes promptly.
                    </p>

                    <h2>Our Team</h2>
                    <p>
                        Our dedicated team of journalists, editors, and content creators work around the clock to bring
                        you the news that matters. With years of combined experience across various beats, we bring
                        expertise, insight, and a commitment to excellence in everything we publish.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        We value your feedback and welcome your story ideas. If you have a news tip, comment, or
                        question, please don&apos;t hesitate to reach out to us through our{' '}
                        <a href="/contact">contact page</a>.
                    </p>

                    <p className="mt-8">
                        Thank you for choosing Sohan Daily News as your source for news and information. We are honored
                        to serve you.
                    </p>
                </div>
            </div>
        </div>
    );
}
