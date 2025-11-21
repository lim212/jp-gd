
// Animated Profile Icon Selector
// Automatically assigns random profile icons to blog authors

export class ProfileIconSelector {
  constructor() {
    this.icons = [
      { id: 1, url: '/images/profile-icons/profile-icon-1.svg', name: 'Admin' },
      { id: 2, url: '/images/profile-icons/profile-icon-2.svg', name: 'Writer' },
      { id: 3, url: '/images/profile-icons/profile-icon-3.svg', name: 'Author' },
      { id: 4, url: '/images/profile-icons/profile-icon-4.svg', name: 'Editor' },
      { id: 5, url: '/images/profile-icons/profile-icon-5.svg', name: 'Blogger' },
      { id: 6, url: '/images/profile-icons/profile-icon-6.svg', name: 'Content Creator' },
      { id: 7, url: '/images/profile-icons/profile-icon-7.svg', name: 'JasaPembayaran' },
      { id: 8, url: '/images/profile-icons/profile-icon-8.svg', name: 'Team' },
      { id: 9, url: '/images/profile-icons/profile-icon-9.svg', name: 'Staff' },
      { id: 10, url: '/images/profile-icons/profile-icon-10.svg', name: 'Manager' },
      { id: 11, url: '/images/profile-icons/profile-icon-11.svg', name: 'Developer' },
      { id: 12, url: '/images/profile-icons/profile-icon-12.svg', name: 'Designer' },
      { id: 13, url: '/images/profile-icons/profile-icon-13.svg', name: 'Marketing' },
      { id: 14, url: '/images/profile-icons/profile-icon-14.svg', name: 'Support' },
      { id: 15, url: '/images/profile-icons/profile-icon-15.svg', name: 'Customer' },
      { id: 16, url: '/images/profile-icons/profile-icon-16.svg', name: 'User' },
      { id: 17, url: '/images/profile-icons/profile-icon-17.svg', name: 'Guest' },
      { id: 18, url: '/images/profile-icons/profile-icon-18.svg', name: 'Member' },
      { id: 19, url: '/images/profile-icons/profile-icon-19.svg', name: 'Expert' },
      { id: 20, url: '/images/profile-icons/profile-icon-20.svg', name: 'Specialist' },
      { id: 21, url: '/images/profile-icons/profile-icon-21.svg', name: 'Consultant' },
      { id: 22, url: '/images/profile-icons/profile-icon-22.svg', name: 'Advisor' },
      { id: 23, url: '/images/profile-icons/profile-icon-23.svg', name: 'Helper' },
      { id: 24, url: '/images/profile-icons/profile-icon-24.svg', name: 'Guide' },
      { id: 25, url: '/images/profile-icons/profile-icon-25.svg', name: 'Professional' },
      { id: 26, url: '/images/profile-icons/profile-icon-26.svg', name: 'Expert' },
      { id: 27, url: '/images/profile-icons/profile-icon-27.svg', name: 'Master' },
      { id: 28, url: '/images/profile-icons/profile-icon-28.svg', name: 'Guru' },
      { id: 29, url: '/images/profile-icons/profile-icon-29.svg', name: 'Leader' },
      { id: 30, url: '/images/profile-icons/profile-icon-30.svg', name: 'Hero' }
    ];
  }

  // Get random icon for author
  getRandomIcon(authorName = 'Admin') {
    const hash = this.hashString(authorName);
    const index = Math.abs(hash) % this.icons.length;
    return this.icons[index];
  }

  // Get consistent icon for author (same author always gets same icon)
  getConsistentIcon(authorName = 'Admin') {
    const hash = this.hashString(authorName);
    const index = Math.abs(hash) % this.icons.length;
    return this.icons[index];
  }

  // Hash function for consistent icon assignment
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Get all available icons
  getAllIcons() {
    return this.icons;
  }

  // Get icon by ID
  getIconById(id) {
    return this.icons.find(icon => icon.id === id) || this.icons[0];
  }
}

// Export singleton instance
export const profileIconSelector = new ProfileIconSelector();
