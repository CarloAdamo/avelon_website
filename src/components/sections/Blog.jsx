import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';

const posts = [
  {
    title: '5 sätt AI-agenter kan transformera ditt företag',
    excerpt: 'Upptäck hur AI-agenter kan automatisera repetitivt arbete och frigöra tid för det som verkligen betyder något.',
    category: 'AI & Automation',
    date: '2024-11-15',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  },
  {
    title: 'Airtable vs traditionella databaser: Vad passar ditt företag?',
    excerpt: 'En djupdykning i när Airtable är det bästa valet och när du bör överväga andra lösningar.',
    category: 'No-Code',
    date: '2024-11-10',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
  {
    title: 'Make vs n8n: Vilken automation-plattform ska du välja?',
    excerpt: 'Jämförelse av de två populäraste automation-plattformarna och deras för- och nackdelar.',
    category: 'Automation',
    date: '2024-11-05',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
  },
];

function BlogCard({ post, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl mb-4">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>{post.readTime} läsning</span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {post.excerpt}
        </p>

        <button className="inline-flex items-center text-gray-900 font-medium group-hover:gap-2 transition-all">
          Läs mer
          <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="py-24 md:py-32 bg-white">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blogg & Resurser
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Läs våra senaste artiklar om AI, automation och modern teknologi för företag.
            Vi delar med oss av våra insikter och best practices.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <BlogCard key={index} post={post} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors">
            Se alla artiklar
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
