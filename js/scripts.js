(function(window, document) {
    // Add smooth scrolling to scrollspy
    $(document).ready(function() {

        // Add smooth scrolling on all links inside the navbar
        $('#navbar a').on('click', function(event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== '') {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                // Using jQuery's animate() method to add smooth page scroll 
                // The optional number (800) specifies the number of milliseconds 
                // it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function() {

                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                });
            } // End if
        });

        // Show or hide the sticky footer button
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                $('.go-top').fadeIn(500);
            } else {
                $('.go-top').fadeOut(300);
            }
        });

        // Animate the scroll to top
        $('.go-top').click(function(event) {
            $(this).blur();
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });

        // Close collapsed menu on click
        $(document).on('click', '.navbar-collapse.show', function(e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                bootstrap.Collapse.getInstance(this).hide();
            }
        });

        // Sticky navbar + manual scroll spy
        var $navLinks = $('.navbar .nav-link');
        var sectionIds = ['aboutMe', 'skills', 'projects', 'experience', 'education', 'hobbies'];

        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();

            // Sticky navbar
            if (scrollTop > 450) {
                $('.navbar').addClass('navbar--scrolled');
            } else {
                $('.navbar').removeClass('navbar--scrolled');
            }

            // Highlight nav item for current section
            var current = null;
            sectionIds.forEach(function(id) {
                var el = document.getElementById(id);
                if (el && scrollTop >= el.offsetTop - 100) {
                    current = id;
                }
            });

            $navLinks.removeClass('active');
            if (current) {
                $navLinks.filter('[href="#' + current + '"]').addClass('active');
                history.replaceState({}, '', '#' + current);
            } else {
                history.replaceState({}, '', window.location.pathname);
            }
        });
    });

    // Add Service Worker
    if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker
            .register('/serviceWorker.js')
            .then(function() {
                console.log("Service Worker Registered");
            });
    }


})(window, document);
