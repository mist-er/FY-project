// API Integration
const API_BASE = 'http://localhost:3000/api';

// Load venues from API
async function loadVenues() {
    try {
        const response = await fetch(`${API_BASE}/venues`);
        const data = await response.json();
        
        if (response.ok) {
            displayVenues(data.venues);
        } else {
            console.error('Error loading venues:', data.message);
            showStaticVenues();
        }
    } catch (error) {
        console.error('Error:', error);
        showStaticVenues();
    }
}

// Display venues in the grid
function displayVenues(venues) {
    const venuesGrid = document.getElementById('venuesGrid');
    if (!venuesGrid) return;
    
    if (venues.length === 0) {
        showStaticVenues();
        return;
    }
    
    // Take first 6 venues for the homepage
    const displayVenues = venues.slice(0, 6);
    venuesGrid.innerHTML = displayVenues.map(venue => createVenueCard(venue)).join('');
}

// Create venue card HTML
function createVenueCard(venue) {
    return `
        <div class="col-lg-4 col-md-6">
            <div class="card venue-card h-100">
                <div class="venue-image" style="background-image: url('${venue.photoUrl || 'https://images.unsplash.com/photo-1519167758481-83f1426e4b1e?auto=format&fit=crop&w=400&q=80'}')">
                    <span class="badge bg-white text-dark venue-price">GHS ${venue.price}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title fw-bold">${venue.name}</h5>
                    <p class="card-text text-muted">${venue.description || 'Perfect venue for your special events.'}</p>
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                        <small class="text-muted">${venue.location}</small>
                    </div>
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-users text-primary me-2"></i>
                        <small class="text-muted">Up to ${venue.capacity} guests</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-light text-dark">
                            <i class="fas fa-star text-warning me-1"></i>
                            4.8
                        </span>
                        <a href="./organizer-dashboard.html" class="btn btn-primary btn-sm">
                            <i class="fas fa-calendar-plus me-1"></i>Book Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show no venues message when API fails
function showStaticVenues() {
    const venuesGrid = document.getElementById('venuesGrid');
    if (!venuesGrid) return;
    
    venuesGrid.innerHTML = `
        <div class="col-12">
            <div class="text-center py-5">
                <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 100px; height: 100px;">
                    <i class="fas fa-building text-muted fs-1"></i>
                </div>
                <h4 class="fw-bold">No venues available</h4>
                <p class="text-muted">We're working on adding amazing venues. Check back soon!</p>
                <a href="./SignUp.html" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>List Your Venue
                </a>
            </div>
        </div>
    `;
}

// Search functionality
function searchVenues() {
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const categorySelect = document.getElementById('categorySelect');
    
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const location = locationSelect?.value || '';
    const category = categorySelect?.value || '';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    
    // Make API call with filters
    fetch(`${API_BASE}/venues/search?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            if (data.venues) {
                displayVenues(data.venues);
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            // Fallback to static venues
            showStaticVenues();
        });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Category card interactions
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // Navigate to organizer dashboard
            window.location.href = './organizer-dashboard.html';
        });
    });
}

// Venue card interactions
function initVenueCards() {
    // Add hover effects and click handlers for venue cards
    document.addEventListener('click', (e) => {
        const venueCard = e.target.closest('.venue-card');
        if (venueCard) {
            // Navigate to organizer dashboard for booking
            window.location.href = './organizer-dashboard.html';
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add loading animation
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="text-center"><div class="loading"></div><p class="mt-2">Loading venues...</p></div>';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Show loading state
    const venuesGrid = document.getElementById('venuesGrid');
    if (venuesGrid) {
        showLoading(venuesGrid);
    }
    
    // Load venues
    loadVenues();
    
    // Initialize components
    initScrollToTop();
    initCategoryCards();
    initVenueCards();
    initSmoothScrolling();
    
    // Add search functionality
    const searchBtn = document.querySelector('.search-form .btn-primary');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchVenues);
    }
    
    // Add search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchVenues();
            }
        });
    }
    
    // Add filter change handlers
    const locationSelect = document.getElementById('locationSelect');
    const categorySelect = document.getElementById('categorySelect');
    
    if (locationSelect) {
        locationSelect.addEventListener('change', searchVenues);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', searchVenues);
    }
    
    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.category-card, .venue-card, .step-icon');
    animateElements.forEach(el => observer.observe(el));
});

// Handle form submissions
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('search-form')) {
        e.preventDefault();
        searchVenues();
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals or dropdowns
    if (e.key === 'Escape') {
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);