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


// Fiter toggle functionality
 
 $('#filterOptions').hide();
        $('#filterBtn').on('click', function() {
            $('#filterOptions').slideToggle();
        });
// End of fiter toggle functionality