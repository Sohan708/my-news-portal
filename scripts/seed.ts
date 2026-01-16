import mongoose from 'mongoose';
import { User, Post, Category, Tag } from '../src/models';
import bcrypt from 'bcryptjs';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://miasohan:Sohan708@my-cluster.r6j2kik.mongodb.net/sohan_blog';

// Sample data
const categories = [
    { name: 'Politics', slug: 'politics', description: 'Political news and analysis', order: 1 },
    { name: 'Technology', slug: 'technology', description: 'Latest tech news and innovations', order: 2 },
    { name: 'Sports', slug: 'sports', description: 'Sports updates and coverage', order: 3 },
    { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, and celebrity news', order: 4 },
    { name: 'Business', slug: 'business', description: 'Business and finance news', order: 5 },
    { name: 'Health', slug: 'health', description: 'Health and wellness', order: 6 },
    { name: 'Science', slug: 'science', description: 'Scientific discoveries and research', order: 7 },
    { name: 'World', slug: 'world', description: 'International news', order: 8 },
];

const tags = [
    { name: 'Breaking News', slug: 'breaking-news' },
    { name: 'Analysis', slug: 'analysis' },
    { name: 'Opinion', slug: 'opinion' },
    { name: 'Investigation', slug: 'investigation' },
    { name: 'Interview', slug: 'interview' },
    { name: 'Technology', slug: 'tech' },
    { name: 'Innovation', slug: 'innovation' },
    { name: 'Trending', slug: 'trending' },
];

const users = [
    {
        name: 'Admin User',
        email: 'admin@newsportal.com',
        password: 'admin123',
        role: 'admin',
        image: 'https://ui-avatars.com/api/?name=Admin+User&background=e11d48&color=fff',
    },
    {
        name: 'John Doe',
        email: 'john@newsportal.com',
        password: 'editor123',
        role: 'editor',
        image: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@newsportal.com',
        password: 'author123',
        role: 'author',
        image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=8b5cf6&color=fff',
    },
];

const posts = [
    {
        title: 'Breaking: Major Technology Breakthrough Announced',
        slug: 'major-technology-breakthrough-announced',
        excerpt: 'Scientists have announced a groundbreaking discovery that could revolutionize the tech industry. This development promises to change how we interact with technology.',
        content: `<h2>A Revolutionary Discovery</h2>
<p>In what experts are calling a "game-changing" development, scientists at leading research institutions have unveiled a breakthrough that could fundamentally alter the technology landscape.</p>

<p>The discovery, which has been years in the making, represents a significant leap forward in our understanding of computing and artificial intelligence. Early tests show promising results that exceed initial expectations.</p>

<h3>What This Means for the Future</h3>
<p>Industry leaders are already expressing excitement about the potential applications of this technology. From healthcare to education, the implications are far-reaching and transformative.</p>

<blockquote>"This is the kind of innovation that comes along once in a generation," said Dr. Emily Chen, lead researcher on the project.</blockquote>

<p>The research team plans to release more details in the coming weeks, with commercial applications expected within the next two years.</p>

<h3>Impact on Daily Life</h3>
<p>Experts predict this technology will eventually become part of our everyday lives, making tasks easier and more efficient. The potential for positive societal impact is enormous.</p>

<p>As we move forward, the tech community watches with anticipation to see how this breakthrough will shape our future.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
        categoryName: 'Technology',
        tagNames: ['Breaking News', 'Technology', 'Innovation'],
        status: 'published',
        isFeatured: true,
        isBreaking: true,
        views: 1250,
        seo: {
            metaTitle: 'Major Technology Breakthrough Announced - Latest News',
            metaDescription: 'Scientists announce groundbreaking technology discovery with far-reaching implications for the future.',
        },
    },
    {
        title: 'Election 2024: Key Candidates Announce Their Platforms',
        slug: 'election-2024-candidates-announce-platforms',
        excerpt: 'As the 2024 election season heats up, major candidates are revealing their policy positions on critical issues facing the nation.',
        content: `<h2>Election Season in Full Swing</h2>
<p>With the 2024 elections approaching, candidates across the political spectrum are making their positions clear on various policy matters that concern voters nationwide.</p>

<h3>Economic Policy</h3>
<p>Economic recovery and growth remain top priorities for all candidates, though their approaches differ significantly. Some advocate for tax reforms while others focus on infrastructure investment.</p>

<h3>Healthcare and Education</h3>
<p>Healthcare accessibility and education reform are also central themes in this election cycle. Candidates are proposing various solutions to address these critical issues.</p>

<p>Voters are encouraged to research each candidate's platform thoroughly before making their decision at the polls.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop',
        categoryName: 'Politics',
        tagNames: ['Analysis', 'Opinion'],
        status: 'published',
        isFeatured: true,
        isBreaking: false,
        views: 890,
    },
    {
        title: 'Championship Finals: Underdogs Claim Victory in Stunning Upset',
        slug: 'championship-finals-underdogs-victory',
        excerpt: 'In an unexpected turn of events, the underdog team secured a dramatic victory in the championship finals, stunning fans and critics alike.',
        content: `<h2>A Historic Victory</h2>
<p>Sports fans witnessed history last night as the underdog team pulled off one of the most surprising victories in championship history.</p>

<h3>The Decisive Moments</h3>
<p>The game was filled with tension and excitement, with the score remaining close throughout. In the final minutes, the underdogs executed a perfect play that sealed their victory.</p>

<p>"We believed in ourselves when no one else did," said team captain Marcus Rodriguez after the game.</p>

<h3>Celebration and Reflection</h3>
<p>The city erupted in celebration as fans took to the streets to honor their champions. This victory will be remembered for years to come.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop',
        categoryName: 'Sports',
        tagNames: ['Breaking News', 'Trending'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 2100,
    },
    {
        title: 'New Study Reveals Benefits of Mediterranean Diet',
        slug: 'mediterranean-diet-health-benefits',
        excerpt: 'Recent research shows the Mediterranean diet offers more health benefits than previously thought, potentially reducing risk of chronic diseases.',
        content: `<h2>Research Findings</h2>
<p>A comprehensive new study has revealed that the Mediterranean diet provides even more health benefits than scientists previously understood.</p>

<h3>Key Benefits</h3>
<ul>
<li>Reduced risk of heart disease</li>
<li>Better cognitive function</li>
<li>Improved longevity</li>
<li>Lower inflammation levels</li>
</ul>

<p>The study followed thousands of participants over a decade, making it one of the most comprehensive dietary studies to date.</p>

<h3>Practical Applications</h3>
<p>Nutritionists recommend incorporating more olive oil, fish, vegetables, and whole grains into your diet while reducing processed foods.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop',
        categoryName: 'Health',
        tagNames: ['Health', 'Analysis'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 650,
    },
    {
        title: 'Box Office: New Marvel Film Breaks Opening Weekend Records',
        slug: 'marvel-film-box-office-records',
        excerpt: 'The latest Marvel superhero film has shattered box office records, earning over $300 million in its opening weekend worldwide.',
        content: `<h2>Record-Breaking Success</h2>
<p>Movie theaters around the world were packed this weekend as the latest Marvel film exceeded all expectations, breaking multiple box office records.</p>

<h3>Fan Response</h3>
<p>Audiences have praised the film's storytelling, visual effects, and character development. Social media buzz has been overwhelmingly positive.</p>

<p>"This is everything fans hoped for and more," said film critic James Martinez.</p>

<h3>Industry Impact</h3>
<p>The success demonstrates the ongoing appeal of superhero films and sets a high bar for upcoming releases in the genre.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop',
        categoryName: 'Entertainment',
        tagNames: ['Trending', 'Entertainment'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 1800,
    },
    {
        title: 'Global Markets Rally on Positive Economic Data',
        slug: 'global-markets-rally-economic-data',
        excerpt: 'Stock markets worldwide experienced significant gains following the release of encouraging economic indicators and corporate earnings.',
        content: `<h2>Market Optimism</h2>
<p>Global stock markets surged today as investors reacted positively to better-than-expected economic data and strong corporate earnings reports.</p>

<h3>Key Indicators</h3>
<p>Employment numbers, consumer spending, and manufacturing output all showed improvement, suggesting economic resilience despite previous concerns.</p>

<blockquote>"The fundamentals look strong, and investors are responding accordingly," noted economist Dr. Robert Williams.</blockquote>

<h3>Looking Ahead</h3>
<p>Market analysts remain cautiously optimistic about continued growth, though they advise monitoring global economic trends closely.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop',
        categoryName: 'Business',
        tagNames: ['Analysis', 'Business'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 420,
    },
    {
        title: 'NASA Discovers Potentially Habitable Exoplanet',
        slug: 'nasa-habitable-exoplanet-discovery',
        excerpt: 'NASA scientists have identified a new exoplanet in the habitable zone of its star, raising exciting possibilities for extraterrestrial life.',
        content: `<h2>A Promising Discovery</h2>
<p>NASA's latest discovery of an Earth-sized exoplanet in the habitable zone has sparked excitement in the scientific community and beyond.</p>

<h3>What Makes It Special</h3>
<p>The planet, located approximately 100 light-years away, orbits its star at just the right distance to potentially support liquid water on its surface.</p>

<p>"This is one of the most promising candidates for habitability we've found," explained Dr. Lisa Chang, project lead astronomer.</p>

<h3>Next Steps</h3>
<p>Researchers plan to use next-generation telescopes to study the planet's atmosphere and search for biosignatures that might indicate the presence of life.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop',
        categoryName: 'Science',
        tagNames: ['Breaking News', 'Science', 'Innovation'],
        status: 'published',
        isFeatured: true,
        isBreaking: false,
        views: 3200,
    },
    {
        title: 'International Climate Summit Reaches Historic Agreement',
        slug: 'climate-summit-historic-agreement',
        excerpt: 'World leaders have agreed to unprecedented measures to combat climate change at the latest international summit.',
        content: `<h2>A Landmark Agreement</h2>
<p>In a historic moment for environmental policy, leaders from over 150 countries have signed a comprehensive agreement to address climate change.</p>

<h3>Key Commitments</h3>
<p>The agreement includes ambitious targets for reducing carbon emissions, transitioning to renewable energy, and protecting natural ecosystems.</p>

<blockquote>"This represents our collective determination to secure a sustainable future for generations to come," stated UN Secretary-General.</blockquote>

<h3>Implementation Challenges</h3>
<p>While the agreement is celebrated, experts acknowledge the significant challenges ahead in implementing these commitments at national and local levels.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200&h=800&fit=crop',
        categoryName: 'World',
        tagNames: ['Breaking News', 'Analysis'],
        status: 'published',
        isFeatured: false,
        isBreaking: true,
        views: 1560,
    },
    {
        title: 'AI Revolution: How Machine Learning is Transforming Industries',
        slug: 'ai-transforming-industries',
        excerpt: 'Artificial intelligence and machine learning are reshaping industries from healthcare to finance, creating new opportunities and challenges.',
        content: `<h2>The AI Transformation</h2>
<p>Artificial intelligence is no longer just a futuristic concept—it's actively reshaping how businesses operate across virtually every sector.</p>

<h3>Healthcare Applications</h3>
<p>In healthcare, AI is improving diagnostic accuracy, personalizing treatment plans, and accelerating drug discovery. Early detection of diseases has improved dramatically.</p>

<h3>Financial Services</h3>
<p>Banks and financial institutions are using AI for fraud detection, risk assessment, and customer service automation, making operations more efficient and secure.</p>

<h3>Ethical Considerations</h3>
<p>As AI adoption grows, important questions about privacy, bias, and job displacement require careful consideration and thoughtful regulation.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
        categoryName: 'Technology',
        tagNames: ['Technology', 'Innovation', 'Analysis'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 980,
    },
    {
        title: 'Startup Success: Young Entrepreneur Builds Billion-Dollar Company',
        slug: 'startup-success-billion-dollar-company',
        excerpt: 'A 28-year-old entrepreneur has built a tech startup valued at over $1 billion in just three years, inspiring a new generation of innovators.',
        content: `<h2>An Inspiring Journey</h2>
<p>What started in a small garage has become a billion-dollar success story, demonstrating the power of innovation and determination.</p>

<h3>The Beginning</h3>
<p>Founder Alex Thompson identified a gap in the market and built a solution that resonated with millions of users worldwide.</p>

<blockquote>"The key was listening to our users and iterating quickly," Thompson explained in a recent interview.</blockquote>

<h3>Lessons for Aspiring Entrepreneurs</h3>
<p>Thompson's journey offers valuable insights: focus on solving real problems, build a strong team, and don't be afraid to take calculated risks.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=800&fit=crop',
        categoryName: 'Business',
        tagNames: ['Business', 'Innovation', 'Interview'],
        status: 'published',
        isFeatured: false,
        isBreaking: false,
        views: 720,
    },
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Post.deleteMany({});
        await Category.deleteMany({});
        await Tag.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create Categories
        console.log('📂 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} categories\n`);

        // Create Tags
        console.log('🏷️  Creating tags...');
        const createdTags = await Tag.insertMany(tags);
        console.log(`✅ Created ${createdTags.length} tags\n`);

        // Create Users
        console.log('👤 Creating users...');
        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            }))
        );
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Create Posts
        console.log('📰 Creating posts...');
        const postsWithRefs = await Promise.all(
            posts.map(async (post, index) => {
                const category = createdCategories.find((c) => c.name === post.categoryName);
                const postTags = createdTags.filter((t) => post.tagNames.includes(t.name));
                const author = createdUsers[index % createdUsers.length];

                return {
                    ...post,
                    category: category?._id,
                    tags: postTags.map((t) => t._id),
                    author: author._id,
                    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                };
            })
        );

        const createdPosts = await Post.insertMany(postsWithRefs);
        console.log(`✅ Created ${createdPosts.length} posts\n`);

        console.log('═══════════════════════════════════════════════');
        console.log('🎉 Database seeding completed successfully!');
        console.log('═══════════════════════════════════════════════\n');

        console.log('📊 Summary:');
        console.log(`   • Categories: ${createdCategories.length}`);
        console.log(`   • Tags: ${createdTags.length}`);
        console.log(`   • Users: ${createdUsers.length}`);
        console.log(`   • Posts: ${createdPosts.length}\n`);

        console.log('👤 Test Users:');
        console.log('   • Admin: admin@newsportal.com / admin123');
        console.log('   • Editor: john@newsportal.com / editor123');
        console.log('   • Author: sarah@newsportal.com / author123\n');

        console.log('🌐 You can now visit http://localhost:3000 to see your news portal!\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();
