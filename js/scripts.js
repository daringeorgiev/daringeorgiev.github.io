(function(window, document) {

    function smoothScrollTo(targetY, duration) {
        var startY = window.scrollY;
        var distance = targetY - startY;
        var startTime = null;
        function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * ease(progress));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // Smooth scroll on navbar link click
    document.querySelectorAll('#navbar a').forEach(function(link) {
        link.addEventListener('click', function(event) {
            if (this.hash !== '') {
                event.preventDefault();
                var target = document.querySelector(this.hash);
                if (target) {
                    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY, 800);
                    history.replaceState({}, '', this.hash);
                }
            }
        });
    });

    // Show or hide the go-top button
    var goTop = document.querySelector('.go-top');
    if (goTop) {
        goTop.style.transition = 'opacity 0.3s';
        goTop.style.opacity = '0';
        goTop.style.pointerEvents = 'none';
        goTop.addEventListener('click', function(event) {
            this.blur();
            event.preventDefault();
            smoothScrollTo(0, 800);
        });
    }

    // Close collapsed navbar on nav link click
    document.addEventListener('click', function(e) {
        var collapse = document.querySelector('.navbar-collapse.show');
        if (collapse && e.target.matches('a') && e.target.className !== 'dropdown-toggle') {
            bootstrap.Collapse.getInstance(collapse).hide();
        }
    });

    // Sticky navbar + manual scroll spy
    var navbar = document.querySelector('.navbar');
    var navbarThreshold = navbar.getBoundingClientRect().top + window.scrollY;
    var navLinks = document.querySelectorAll('.navbar .nav-link');
    var sectionIds = ['aboutMe', 'skills', 'projects', 'experience', 'education', 'hobbies'];

    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;

        // Go-top button visibility
        if (goTop) {
            if (scrollTop > 200) {
                goTop.style.opacity = '1';
                goTop.style.pointerEvents = 'auto';
            } else {
                goTop.style.opacity = '0';
                goTop.style.pointerEvents = 'none';
            }
        }

        // Sticky navbar
        if (scrollTop > navbarThreshold) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // Highlight nav item for current section
        var current = null;
        sectionIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el && scrollTop >= el.offsetTop - 100) {
                current = id;
            }
        });

        navLinks.forEach(function(link) { link.classList.remove('active'); });
        if (current) {
            var activeLink = document.querySelector('.navbar .nav-link[href="#' + current + '"]');
            if (activeLink) activeLink.classList.add('active');
            history.replaceState({}, '', '#' + current);
        } else {
            history.replaceState({}, '', window.location.pathname);
        }
    });

    // Restore clean URL for print header/footer
    window.addEventListener('beforeprint', function() {
        history.replaceState({}, '', window.location.pathname);
    });

    // Register Service Worker
    if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker
            .register('/serviceWorker.js')
            .then(function() {
                console.log("Service Worker Registered");
            });
    }

})(window, document);
