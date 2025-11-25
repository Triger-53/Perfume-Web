/**
 * Utility to fix broken image URLs by mapping them to working Unsplash images.
 * This allows the app to work with existing bad data without requiring a database reset.
 */

const IMAGE_MAPPINGS: { [key: string]: string } = {
    // Categories
    'https://i.imgur.com/2e5sTml.jpg': 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800', // Floral - Pink flowers
    'https://i.imgur.com/sIuG26J.jpg': 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800', // Woody
    'https://i.imgur.com/qjFpM5N.jpg': 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800', // Fresh
    'https://i.imgur.com/sB15y9G.jpg': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=800', // Oriental - Spices/Dark

    // Products
    'https://i.imgur.com/5q0dLLi.png': 'https://images.unsplash.com/photo-1557827983-08e37536d7a9?auto=format&fit=crop&q=80&w=800', // Sauvage - Dark/Masculine
    'https://i.imgur.com/sC2a2rT.png': 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800', // Tobacco Vanille - Warm/Woody
    'https://i.imgur.com/aG3Jt2g.png': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800', // Peony & Blush
    'https://i.imgur.com/Lp3r5fM.png': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', // Aventus
    'https://i.imgur.com/JqC79gT.png': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800', // Light Blue
    'https://i.imgur.com/8hV3TAv.png': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800', // Good Girl
    'https://i.imgur.com/rO9gC9x.png': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', // Miss Dior
    'https://i.imgur.com/n3yv1jQ.png': 'https://images.unsplash.com/photo-1583467875263-d502c8c2367e?auto=format&fit=crop&q=80&w=800', // Bleu de Chanel - Blue bottle

    // Hero / Misc
    'https://i.imgur.com/E3l9V1s.jpg': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=1600', // Hero - Better perfume display
    'https://i.imgur.com/5Q20j2s.png': '/logo.svg', // Logo
};

export const fixImageUrl = (url: string | null | undefined): string => {
    if (!url) return 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&q=80&w=800'; // Default fallback
    return IMAGE_MAPPINGS[url] || url;
};
