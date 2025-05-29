/**
 * Avatar Generator using DiceBear API
 * Generates consistent avatars based on user's name or email
 */

// Available avatar styles from DiceBear
const AVATAR_STYLES = {
    ADVENTURER: 'adventurer',
    ADVENTURER_NEUTRAL: 'adventurer-neutral', 
    AVATAAARS: 'avataaars',
    BIG_EARS: 'big-ears',
    BIG_EARS_NEUTRAL: 'big-ears-neutral',
    BIG_SMILE: 'big-smile',
    BOTTTS: 'bottts',
    CROODLES: 'croodles',
    CROODLES_NEUTRAL: 'croodles-neutral',
    FUN_EMOJI: 'fun-emoji',
    ICONS: 'icons',
    IDENTICON: 'identicon',
    INITIALS: 'initials',
    LORELEI: 'lorelei',
    LORELEI_NEUTRAL: 'lorelei-neutral',
    MICAH: 'micah',
    MINIAVS: 'miniavs',
    OPEN_PEEPS: 'open-peeps',
    PERSONAS: 'personas',
    PIXEL_ART: 'pixel-art',
    PIXEL_ART_NEUTRAL: 'pixel-art-neutral',
    SHAPES: 'shapes',
    THUMBS: 'thumbs'
};

/**
 * Generate avatar URL using DiceBear API
 * @param {string} seed - Unique identifier (name, email, etc.)
 * @param {string} style - Avatar style (default: 'initials')
 * @param {number} size - Avatar size in pixels (default: 100)
 * @param {Object} options - Additional options
 * @returns {string} Avatar URL
 */
export const generateAvatar = (
    seed, 
    style = AVATAR_STYLES.INITIALS, 
    size = 100, 
    options = {}
) => {
    if (!seed) {
        seed = 'default-user';
    }

    // Clean the seed (remove spaces, special characters)
    const cleanSeed = seed.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Base URL for DiceBear API
    const baseUrl = 'https://api.dicebear.com/7.x';
    
    // Build URL with parameters
    const params = new URLSearchParams({
        seed: cleanSeed,
        size: size.toString(),
        format: 'svg',
        ...options
    });

    return `${baseUrl}/${style}/svg?${params.toString()}`;
};

/**
 * Generate avatar for user profile
 * @param {Object} user - User object with fullname
 * @returns {string} Avatar URL
 */
export const generateUserAvatar = (user) => {
    if (!user) return generateAvatar('default-user');
    
    const { fullname, email } = user;
    let seed = '';
    
    if (fullname) {
        if (typeof fullname === 'string') {
            seed = fullname;
        } else if (fullname.firstname && fullname.lastname) {
            seed = `${fullname.firstname} ${fullname.lastname}`;
        } else if (fullname.firstname) {
            seed = fullname.firstname;
        }
    } else if (email) {
        seed = email;
    }
    
    return generateAvatar(seed, AVATAR_STYLES.INITIALS, 100, {
        backgroundColor: '3B82F6', // Blue background
        textColor: 'FFFFFF' // White text
    });
};

/**
 * Generate avatar for captain profile
 * @param {Object} captain - Captain object with fullname
 * @returns {string} Avatar URL
 */
export const generateCaptainAvatar = (captain) => {
    if (!captain) return generateAvatar('default-captain');
    
    const { fullname, email } = captain;
    let seed = '';
    
    if (fullname) {
        if (typeof fullname === 'string') {
            seed = fullname;
        } else if (fullname.firstname && fullname.lastname) {
            seed = `${fullname.firstname} ${fullname.lastname}`;
        } else if (fullname.firstname) {
            seed = fullname.firstname;
        }
    } else if (email) {
        seed = email;
    }
    
    return generateAvatar(seed, AVATAR_STYLES.INITIALS, 100, {
        backgroundColor: '10B981', // Green background
        textColor: 'FFFFFF' // White text
    });
};

/**
 * Generate fun avatar styles for variety
 */
export const generateFunAvatar = (seed, userType = 'user') => {
    const funStyles = [
        AVATAR_STYLES.ADVENTURER,
        AVATAR_STYLES.AVATAAARS,
        AVATAR_STYLES.BIG_SMILE,
        AVATAR_STYLES.LORELEI,
        AVATAR_STYLES.MICAH,
        AVATAR_STYLES.OPEN_PEEPS
    ];
    
    // Use seed to consistently pick a style
    const styleIndex = seed.length % funStyles.length;
    const selectedStyle = funStyles[styleIndex];
    
    const backgroundColor = userType === 'captain' ? '10B981' : '3B82F6';
    
    return generateAvatar(seed, selectedStyle, 100, {
        backgroundColor: backgroundColor
    });
};

/**
 * Generate Gravatar URL as fallback
 * @param {string} email - User email
 * @param {number} size - Avatar size
 * @returns {string} Gravatar URL
 */
export const generateGravatar = (email, size = 100) => {
    if (!email) return generateAvatar('default-user');
    
    // Simple hash function for email (not cryptographically secure, just for demo)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use hash as seed for consistent avatar
    return generateAvatar(Math.abs(hash).toString(), AVATAR_STYLES.IDENTICON, size);
};

/**
 * Get avatar with fallback options
 * @param {Object} user - User or captain object
 * @param {string} userType - 'user' or 'captain'
 * @param {string} style - Preferred style
 * @returns {string} Avatar URL
 */
export const getAvatarWithFallback = (user, userType = 'user', style = 'initials') => {
    try {
        if (userType === 'captain') {
            return generateCaptainAvatar(user);
        } else {
            return generateUserAvatar(user);
        }
    } catch (error) {
        console.error('Error generating avatar:', error);
        return generateAvatar('fallback-user', AVATAR_STYLES.INITIALS);
    }
};

// Export styles for external use
export { AVATAR_STYLES };
