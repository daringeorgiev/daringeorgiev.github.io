(function(window, document) {
    // Add smooth scrolling to scrollspy
    $(document).ready(function() {
        // Add scrollspy to <body>
        $('body').scrollspy({
            target: ".navbar",
            offset: 50
        });

        // Add smooth scrolling on all links inside the navbar
        $("#navbar a").on('click', function(event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                // Using jQuery's animate() method to add smooth page scroll The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
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
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        })

        // Close collapsed menu on click
        $(document).on('click', '.navbar-collapse.in', function(e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
        });
    });

    // Update address bar, when scroll to top
    $(window).scroll(function() {
        if ($(this).scrollTop() === 0) {
            window.location.hash = ''
        }
    });

    // Update address bar on scroll
    $(window).on('activate.bs.scrollspy', function(e) {
      // This check prevent undefined from IE url
      // TODO: Find a better way of doing that
      if ($("a[href^='#']", e.target).attr("href")) {
          history.replaceState({}, "", $("a[href^='#']", e.target).attr("href"));
      }
    });
})(window, document);
