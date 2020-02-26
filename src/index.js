// Reference: https://css-tricks.com/the-complete-guide-to-lazy-loading-images/

document.addEventListener('DOMContentLoaded', function() {
  if ('IntersectionObserver' in window) {
    modernLazyLoadImages();
  } else {
    vanillaJSLazyLoadImages();
  }
});

/**
 * For better performance provided by modern support.
 * Finds img tags with data-src attribute and lazy class.
 */
function modernLazyLoadImages() {
  const lazyLoadImages = document.querySelectorAll('.lazy');
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.classList.remove('lazy');
        imageObserver.unobserve(image);
      }
    });
  });

  lazyLoadImages.forEach(function(image) {
    imageObserver.observe(image);
  });
}

/**
 * For IE support, but uses a timeout.
 * Finds img tags with data-src attribute and lazy class.
 */
function vanillaJSLazyLoadImages() {
  let lazyLoadThrottleTimeout;
  const lazyLoadImages = document.querySelectorAll('.lazy');

  /** lazy load listener callback */
  function lazyLoad() {
    if (lazyLoadThrottleTimeout) {
      clearTimeout(lazyLoadThrottleTimeout);
    }

    lazyLoadThrottleTimeout = setTimeout(function() {
      const scrollTop = window.pageYOffset;
      lazyLoadImages.forEach(function(img) {
        if (img.offsetTop < window.innerHeight + scrollTop) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
        }
      });
      if (lazyLoadImages.length == 0) {
        document.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationChange', lazyLoad);
      }
    }, 20);
  }

  document.addEventListener('scroll', lazyLoad);
  window.addEventListener('resize', lazyLoad);
  window.addEventListener('orientationChange', lazyLoad);
}
