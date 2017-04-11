(function ($, Drupal) {
  Drupal.behaviors.sq1Slideshow = {
    attach: function (context, settings) {

      function tagSlides(element) {

        // Mark the current slide.
        $(element).children('.sq1-slide').eq($(element).data('currentSlide')).addClass('current');

      }

      function decrementSlideIndex(current, limit) {

        var index = current;

        if (current > 0) {
          index--;
        } else {
          index = limit;
        }

        return index;

      }

      function incrementSlideIndex(current, limit) {

        var index = current;

        if (current < limit) {
          index++;
        } else {
          index = 0;
        }

        return index;

      }

      function autoplaySlideshow(element) {

        // If the slideshow is set to autoplay...
        if ($(element).data('autoplay')) {

          advanceSlideshow(element);

        }

      }

      function advanceSlideshow(element) {

        // If the slideshow is not in a locked state...
        if ($(element).data('locked') == false) {

          // Lock the slideshow.
          $(element).data('locked', true);

          // Remove any classes tagging a slide as current.
          $(element).children('.sq1-slide').removeClass('current');

          var slideCount = $(element).children('.sq1-slide').length;
          
          // Get index for the next slide.
          var nextSlideIndex = incrementSlideIndex($(element).data('currentSlide'), (slideCount - 1));

          // Get index for the on deck slide.
          var ondeckSlideIndex = incrementSlideIndex(nextSlideIndex, (slideCount - 1));

          // Update the current slide index.
          $(element).data('currentSlide', nextSlideIndex);

          // Position the on deck slide.
          $(element).children('.sq1-slide').eq( ondeckSlideIndex ).css({'left': '154%'})

          // Move all slides.
          $(element).children('.sq1-slide').animate({
            'left': '-=77%'
          },{
            'complete': function() {
              // Unlock the slideshow.
              $(element).data('locked', false);
              tagSlides(element);
            }
          });

        }

      }

      function retreatSlideshow(element) {

        // If the slideshow is not in a locked state...
        if ($(element).data('locked') == false) {

          // Lock the slideshow.
          $(element).data('locked', true);

          // Remove any classes tagging a slide as current.
          $(element).children('.sq1-slide').removeClass('current');

          var slideCount = $(element).children('.sq1-slide').length;
          
          // Get index for the next slide.
          var nextSlideIndex = decrementSlideIndex($(element).data('currentSlide'), (slideCount - 1));

          // Get index for the on deck slide.
          var ondeckSlideIndex = decrementSlideIndex(nextSlideIndex, (slideCount - 1));

          // Update the current slide index.
          $(element).data('currentSlide', nextSlideIndex);

          // Position the on deck slide.
          $(element).children('.sq1-slide').eq( ondeckSlideIndex ).css({'left': '-154%'})

          // Move all slides.
          $(element).children('.sq1-slide').animate({
            'left': '+=77%'
          },{
            'complete': function() {
              // Unlock the slideshow.
              $(element).data('locked', false);
              tagSlides(element)
            }
          });

        }

      }

      function prepareSlideshow(element) {

        // By default, the slideshow is not in a locked state.
        $(element).data('locked', false);

        // By default, the slideshow is set to autoplay.
        $(element).data('autoplay', true);

        // By default, the current slide is 0.
        $(element).data('currentSlide', 0);

        // Tag slides.
        tagSlides(element);

        // When a slide is clicked...
        $(element).children('.sq1-slide').click(function(event){

          // If the clicked slide is not the current slide...
          if ( $(element).data('currentSlide') !== $(this).index() ) {

            // Disable autoplay.
            $(element).data('autoplay', false);

            event.preventDefault();

            // If this slide position is positive...
            if ($(this).position().left > 0) {

              advanceSlideshow(element);

            }

            // Else, if this slide position is negative...
            else if ($(this).position().left < 0) {

              retreatSlideshow(element);
              
            }

          }

        });

        if ($(element).hasClass('autoplay')) {

          $(element).data('timer', setInterval(function(){autoplaySlideshow(element)}, 3000));

        }

      }


      // Loop through all SQ1 slideshows on this page.
      $('.sq1-slideshow').each(function(){

        // Prepare this slideshow.
        prepareSlideshow($(this));

      });

    }
  };
})(jQuery, Drupal);
