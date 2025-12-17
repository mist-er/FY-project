/**
 * Dark Theme Toggle Script
 * Manages theme switching and persistence
 */

class ThemeToggle {
  constructor() {
    this.STORAGE_KEY = 'eFinder-theme';
    this.LIGHT_THEME = 'light';
    this.DARK_THEME = 'dark';
    this.init();
    
    // Make instance globally accessible for debugging
    window.themeToggleInstance = this;
  }

  /**
   * Initialize theme toggle
   */
  init() {
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? this.DARK_THEME : this.LIGHT_THEME);

    // Apply theme
    this.setTheme(initialTheme);

    // Listen for theme toggle button clicks
    this.setupEventListeners();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME);
      }
    });
  }

  /**
   * Set theme and save preference
   */
  setTheme(theme) {
    if (theme === this.DARK_THEME || theme === this.LIGHT_THEME) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateToggleIcon(theme);
      this.updateMetaThemeColor(theme);
    }
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME;
    const newTheme = currentTheme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    this.setTheme(newTheme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME;
  }

  /**
   * Update toggle button icon
   */
  updateToggleIcon(theme) {
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach((btn) => {
      if (theme === this.DARK_THEME) {
        btn.innerHTML = '<i class="fas fa-sun"></i>';
        btn.title = 'Switch to Light Theme';
        btn.setAttribute('aria-label', 'Switch to Light Theme');
      } else {
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        btn.title = 'Switch to Dark Theme';
        btn.setAttribute('aria-label', 'Switch to Dark Theme');
      }
    });
  }

  /**
   * Update meta theme-color tag
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    if (theme === this.DARK_THEME) {
      metaThemeColor.content = '#1a1a1a';
    } else {
      metaThemeColor.content = '#2c3e50';
    }
  }

  /**
   * Setup event listeners for theme toggle
   */
  setupEventListeners() {
    const self = this; // Capture context
    
    const setupButtons = () => {
      const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
      console.log(`Setting up ${toggleButtons.length} theme toggle buttons`);
      
      toggleButtons.forEach((btn) => {
        // Remove existing listeners if any
        if (!btn.hasAttribute('data-listener')) {
          btn.setAttribute('data-listener', 'true');
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Theme toggle clicked');
            self.toggleTheme();
          });
        }
      });
    };

    // Setup initial buttons
    setupButtons();

    // Also watch for dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      const hasNewButtons = mutations.some(mutation => {
        if (mutation.addedNodes.length) {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              if (node.classList && (node.classList.contains('theme-toggle-btn') || 
                  node.querySelector('.theme-toggle-btn'))) {
                return true;
              }
            }
          }
        }
        return false;
      });
      
      if (hasNewButtons) {
        setupButtons();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Initialize theme toggle when DOM is ready
function initThemeToggle() {
  console.log('ThemeToggle initializing...');
  const buttons = document.querySelectorAll('.theme-toggle-btn');
  console.log(`Found ${buttons.length} theme toggle buttons`);
  
  if (typeof window.themeToggleInstance === 'undefined') {
    new ThemeToggle();
    console.log('ThemeToggle instance created');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  // DOM already loaded
  initThemeToggle();
}

// Safety check - try again after a short delay if buttons aren't found
setTimeout(() => {
  if (document.querySelectorAll('.theme-toggle-btn').length > 0 && 
      typeof window.themeToggleInstance === 'undefined') {
    console.log('Retry initialization...');
    initThemeToggle();
  }
}, 500);
