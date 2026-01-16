import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Category, Tag, Post } from '../src/models';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Tag.deleteMany({}),
            Post.deleteMany({}),
        ]);
        console.log('✅ Existing data cleared\n');

        // 1. Create Users
        console.log('📂 Creating users...');
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const [admin, editor, author] = await User.create([
            {
                name: 'Admin User',
                email: 'admin@newsportal.com',
                password: hashedPassword,
                role: 'admin',
                image: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
            },
            {
                name: 'Editor User',
                email: 'editor@newsportal.com',
                password: hashedPassword,
                role: 'editor',
                image: 'https://ui-avatars.com/api/?name=Editor+User&background=8B5CF6&color=fff',
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah@newsportal.com',
                password: hashedPassword,
                role: 'author',
                image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=EC4899&color=fff',
            },
        ]);
        console.log('✅ Users created\n');

        // 2. Create Categories
        console.log('📂 Creating categories...');
        const [technology, business, sports, entertainment, health, science] = await Category.create([
            { name: 'Technology', slug: 'technology', description: 'Latest tech news and innovations' },
            { name: 'Business', slug: 'business', description: 'Business and finance news' },
            { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
            { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, and celebrity news' },
            { name: 'Health', slug: 'health', description: 'Health and wellness' },
            { name: 'Science', slug: 'science', description: 'Scientific discoveries and research' },
        ]);
        console.log('✅ Categories created\n');

        // 3. Create Tags
        console.log('📂 Creating tags...');
        const [aiTag, cryptoTag, stocksTag, footballTag, netflixTag] = await Tag.create([
            { name: 'AI', slug: 'ai' },
            { name: 'Cryptocurrency', slug: 'cryptocurrency' },
            { name: 'Stock Market', slug: 'stock-market' },
            { name: 'Football', slug: 'football' },
            { name: 'Netflix', slug: 'netflix' },
        ]);
        console.log('✅ Tags created\n');

        // 4. Create Posts
        console.log('📂 Creating posts...');
        const posts = [
            {
                title: 'The Future of Artificial Intelligence in 2024',
                slug: 'future-of-ai-2024',
                excerpt: 'Exploring the latest trends and predictions for AI technology',
                content: '<h2>Introduction to AI</h2><p>Artificial Intelligence continues to revolutionize our world. From machine learning to natural language processing, AI is transforming industries across the globe.</p><h3>Key Developments</h3><p>Recent breakthroughs in AI include improved language models, computer vision advancements, and more efficient algorithms. These developments are making AI more accessible and powerful than ever before.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
                category: technology._id,
                tags: [aiTag._id],
                author: author._id,
                status: 'published',
                isFeatured: true,
                views: 1250,
                publishedAt: new Date(),
            },
            {
                title: 'Cryptocurrency Market Sees Major Rally',
                slug: 'crypto-market-rally',
                excerpt: 'Bitcoin and Ethereum reach new heights as institutional adoption grows',
                content: '<h2>Market Analysis</h2><p>The cryptocurrency market has experienced significant growth over the past month, with Bitcoin surpassing key resistance levels and Ethereum showing strong momentum.</p><p>Institutional investors are increasingly viewing crypto as a legitimate asset class, contributing to the sustained rally.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=600&fit=crop',
                category: business._id,
                tags: [cryptoTag._id, stocksTag._id],
                author: author._id,
                status: 'published',
                views: 890,
                publishedAt: new Date(Date.now() - 86400000),
            },
            {
                title: 'Champions League: Epic Semifinal Showdown',
                slug: 'champions-league-semifinal',
                excerpt: 'Top European clubs battle for a spot in the final',
                content: '<h2>Match Preview</h2><p>The Champions League semifinals promise thrilling football action as Europe\'s elite clubs compete for glory.</p><p>Expert analysis and predictions for the upcoming matches.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
                category: sports._id,
                tags: [footballTag._id],
                author: editor._id,
                status: 'published',
                views: 650,
                publishedAt: new Date(Date.now() - 172800000),
            },
            {
                title: 'Netflix Announces Exciting New Original Series',
                slug: 'netflix-new-series',
                excerpt: 'Streaming giant reveals lineup for upcoming season',
                content: '<h2>Coming Soon</h2><p>Netflix has unveiled its latest slate of original programming, featuring diverse genres and star-studded casts.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=600&fit=crop',
                category: entertainment._id,
                tags: [netflixTag._id],
                author: author._id,
                status: 'published',
                views: 430,
                publishedAt: new Date(Date.now() - 259200000),
            },
            {
                title: 'Breakthrough in Cancer Research',
                slug: 'cancer-research-breakthrough',
                excerpt: 'Scientists discover promising new treatment method',
                content: '<h2>Medical Advancement</h2><p>Researchers have made a significant breakthrough in cancer treatment, offering new hope for patients worldwide.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop',
                category: health._id,
                tags: [],
                author: admin._id,
                status: 'published',
                views: 780,
                publishedAt: new Date(Date.now() - 345600000),
            },
            {
                title: 'Space Exploration: Mars Mission Update',
                slug: 'mars-mission-update',
                excerpt: 'Latest developments from NASA\'s Mars exploration program',
                content: '<h2>Mission Progress</h2><p>NASA provides exciting updates on the ongoing Mars exploration mission, including new discoveries and future plans.</p>',
                featuredImage: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=600&fit=crop',
                category: science._id,
                tags: [],
                author: admin._id,
                status: 'published',
                views: 920,
                publishedAt: new Date(Date.now() - 432000000),
            },
        ];

        await Post.create(posts);
        console.log('✅ Posts created\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   • Users: 3`);
        console.log(`   • Categories: 6`);
        console.log(`   • Tags: 5`);
        console.log(`   • Posts: ${posts.length}`);
        console.log('\n✅ You can now visit http://localhost:3000 to see your news portal!\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
    }
}

// Run seeding
connectDB().then(seedDatabase).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
