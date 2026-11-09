/**
 * Studio Content Data — Dibyajyoti Nayak
 *
 * Studio is social handles ONLY: Boss's Instagram, LinkedIn and
 * GitHub profiles. Projects, education and milestones live in the
 * Gallery and About rooms, so nothing is lost from the site overall.
 * No invented followers/views/links — every URL is one of his three
 * real profiles. The tower repeats these 3 items to stay tall enough
 * to scroll through (see StudioRoom.jsx MIN_TOWER_ITEMS).
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'Video',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Notes',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'Short',
        shape: 'phone', // Vertical phone
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'monitor',
    },
    github: {
        color: '#181717',
        accentColor: '#24292F',
        icon: 'GH',
        label: 'GitHub',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
};

const GH = 'https://github.com/dibyajyoti630';
const LI = 'https://www.linkedin.com/in/dibyajyoti-nayak-b5179b320';
const IG = 'https://www.instagram.com/dibya_loves_j/';

// Content data — social profiles only (see header)
const RAW_CONTENT_DATA = [
    // ============ Profiles (first monitors in the Studio) ============
    {
        id: 'profile-instagram',
        platform: 'instagram',
        title: 'Instagram — @dibya_loves_j',
        description: 'Follow me on Instagram for project updates and what I am building.',
        thumbnail: null,
        url: IG,
        date: '2026-11',
        frontTexture: '/textures/studio/instagramfront.webp',
        paintedFrontTexture: '/textures/studio/instagramfront_painted.webp',
    },
    {
        id: 'profile-linkedin',
        platform: 'linkedin',
        title: 'LinkedIn — Dibyajyoti Nayak',
        description: 'Connect with me on LinkedIn — B.Tech CSE 2026, GIET Gunupur, and TCS Ninja offer in hand.',
        thumbnail: null,
        url: LI,
        date: '2026-11',
        frontTexture: '/textures/studio/linkedinfront.webp',
        paintedFrontTexture: '/textures/studio/linkedinfront_painted.webp',
    },
    {
        id: 'profile-github',
        platform: 'github',
        title: 'GitHub — github.com/dibyajyoti630',
        description: 'All five projects live on GitHub — GuardianSOS, RedZone, Fit Fusion, AirCanvas and the Object Detection Tool.',
        thumbnail: null,
        url: GH,
        date: '2026-11',
        frontTexture: '/textures/studio/githubfront.webp',
        paintedFrontTexture: '/textures/studio/githubfront_painted.webp',
    },

];
export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    // Every item carries its own front texture now (social profiles only);
    // fall back to the generic monitor frame if one is ever missing.
    return {
        ...item,
        frontTexture: item.frontTexture || '/textures/studio/monitor_front.webp',
        paintedFrontTexture: item.paintedFrontTexture || '/textures/studio/monitor_front_painted.webp',
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
