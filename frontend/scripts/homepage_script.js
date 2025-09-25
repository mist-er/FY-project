// navbar toggle functionality
$(document).ready(function() {
    function setNavListDisplay() {
        if ($(window).width() > 1024) {
            $('.nav-list').stop().css({
                'display': 'flex',
                'height': '',
            });
        } else {
            $('.nav-list').stop().css({
                'display': 'none',
                'height': '',
            });
        }
    }
    setNavListDisplay();

    $(window).on('resize', function() {
        setNavListDisplay();
    });

    $('.navbar').on('mouseenter', function() {
        if ($(window).width() <= 1024) {
            $('.nav-list').stop().slideDown(200);
        }
    });

    $('.navbar').on('mouseleave', function() {
        if ($(window).width() <= 1024) {
            $('.nav-list').stop().slideUp(200);
        }
    });
});

// Filter toggle functionality
$('#filterOptions').hide();
$('#filterBtn').on('click', function() {
    $('#filterOptions').slideToggle();
});

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
        }
    } catch (error) {
        console.error('Error:', error);
        // Show static venues as fallback
        showStaticVenues();
    }
}

// Display venues from API
function displayVenues(venues) {
    const venueCards = document.querySelector('.venue__cards');
    const resultsHeader = document.querySelector('.results__header h2');
    
    // Update results count
    resultsHeader.textContent = `${venues.length} venues found`;
    
    // Clear existing cards
    venueCards.innerHTML = '';
    
    // Create venue cards
    venues.forEach(venue => {
        const venueCard = createVenueCard(venue);
        venueCards.appendChild(venueCard);
    });
}

// Create venue card element
function createVenueCard(venue) {
    const card = document.createElement('div');
    card.className = 'venue__card';
    
    const photoUrl = venue.photoUrl ? 
        `http://localhost:3000${venue.photoUrl}` : 
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';
    
    card.innerHTML = `
        <img src="${photoUrl}" alt="${venue.name}" class="venue__img">
        <div class="venue__info">
            <div class="venue__title">
                ${venue.name}
                <span class="venue__rating">★ 4.8</span>
            </div>
            <div class="venue__location">${venue.location}</div>
            <div class="venue__capacity">Up to ${venue.capacity} guests</div>
            <div class="venue__tags">
                <span>Parking</span>
                <span>Catering</span>
                <span>Sound System</span>
                <span>+1 more</span>
            </div>
            <div class="venue__price-status">
                <span class="venue__price">GHS ${venue.price} <span class="venue__perday">per day</span></span>
                <span class="venue__available">Available</span>
            </div>
        </div>
    `;
    
    return card;
}

// Show static venues as fallback
function showStaticVenues() {
    console.log('Showing static venues as fallback');
    // Keep the existing static HTML content
}

// Search functionality
function searchVenues() {
    const searchTerm = document.querySelector('.search__bar').value;
    const locationFilter = document.querySelector('.filter__select').value;
    const capacityFilter = document.querySelector('.filter__select').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (locationFilter && locationFilter !== 'All locations') {
        params.append('location', locationFilter);
    }
    
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
        });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load venues on page load
    loadVenues();
    
    // Add search functionality
    const searchBar = document.querySelector('.search__bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchVenues();
            }
        });
    }
    
    // Add filter functionality
    const filterSelects = document.querySelectorAll('.filter__select');
    filterSelects.forEach(select => {
        select.addEventListener('change', searchVenues);
    });
});

// Update navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        if (link.textContent === 'Find Venue') {
            link.href = './organizer-dashboard.html';
        } else if (link.textContent === 'Venue Listing') {
            link.href = './owner-dashboard.html';
        }
    });
});