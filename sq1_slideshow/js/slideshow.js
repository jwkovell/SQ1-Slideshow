(function ($, Drupal) {
  Drupal.behaviors.sq1Slideshow = {
    attach: function (context, settings) {

      function tagSlides(element) {

        // Mark the current slide.
        $(element).find('.sq1-slide').eq($(element).data('currentSlide')).addClass('current');

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

      function positionSlides(element) {

        // Get slide increment width.
        var slideshowWidth = $(element).width();
        var slideWidth = $(element).find('.sq1-slide').first().width();
        var incrementWidth = ((slideWidth / slideshowWidth) * 100) + 2;

        var slideCount = $(element).find('.sq1-slide').length;

        // Position all slides.
        $(element).find('.sq1-slide').css({'left': (slideCount * 100) + '%'});

        // Get index for the current slide.
        var currentSlideIndex = $(element).data('currentSlide');

        // Position the next slide.
        $(element).find('.sq1-slide').eq( currentSlideIndex ).css({'left': '0%'});

        // Get index for the next slide.
        var nextSlideIndex = incrementSlideIndex(currentSlideIndex, (slideCount - 1));

        // Position the next slide.
        $(element).find('.sq1-slide').eq( nextSlideIndex ).css({'left': incrementWidth + '%'});

        // Get index for the previous slide.
        var previousSlideIndex = decrementSlideIndex(currentSlideIndex, (slideCount - 1));

        // Position the previous slide.
        $(element).find('.sq1-slide').eq( previousSlideIndex ).css({'left': '-' + incrementWidth + '%'});

      }

      function advanceSlideshow(element) {

        // If the slideshow is not in a locked state...
        if ($(element).data('locked') == false) {

          // Get slide increment width.
          var slideshowWidth = $(element).width();
          var slideWidth = $(element).find('.sq1-slide').first().width();
          var incrementWidth = ((slideWidth / slideshowWidth) * 100) + 2;

          // Lock the slideshow.
          $(element).data('locked', true);

          // Remove any classes tagging a slide as current.
          $(element).find('.sq1-slide').removeClass('current');

          // Get slide count.
          var slideCount = $(element).find('.sq1-slide').length;

          // Get index for the current slide.
          var currentSlideIndex = $(element).data('currentSlide');

          // Get index for the next slide.
          var nextSlideIndex = incrementSlideIndex(currentSlideIndex, (slideCount - 1));

          // Position slides.
          positionSlides(element);

          // Get index for the on deck slide.
          var ondeckSlideIndex = incrementSlideIndex(nextSlideIndex, (slideCount - 1));

          // Position the on deck slide.
          $(element).find('.sq1-slide').eq( ondeckSlideIndex ).css({'left': (incrementWidth * 2) + '%'});

          // Update the current slide index.
          $(element).data('currentSlide', nextSlideIndex);

          // Move all slides.
          $(element).find('.sq1-slide').animate({
            'left': '-=' + incrementWidth + '%'
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

          // Get slide increment width.
          var slideshowWidth = $(element).width();
          var slideWidth = $(element).find('.sq1-slide').first().width();
          var incrementWidth = ((slideWidth / slideshowWidth) * 100) + 2;

          // Remove any classes tagging a slide as current.
          $(element).find('.sq1-slide').removeClass('current');

          // Get slide count.
          var slideCount = $(element).find('.sq1-slide').length;

          // Get index for the current slide.
          var currentSlideIndex = $(element).data('currentSlide');
          
          // Get index for the previous slide.
          var previousSlideIndex = decrementSlideIndex(currentSlideIndex, (slideCount - 1));

          // Position slides.
          positionSlides(element);

          // Get index for the on deck slide.
          var ondeckSlideIndex = decrementSlideIndex(previousSlideIndex, (slideCount - 1));

          // Position the on deck slide.
          $(element).find('.sq1-slide').eq( ondeckSlideIndex ).css({'left': '-' + (incrementWidth * 2) + '%'});

          // Update the current slide index.
          $(element).data('currentSlide', previousSlideIndex);

          // Move all slides.
          $(element).find('.sq1-slide').animate({
            'left': '+=' + incrementWidth + '%'
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
        $(element).find('.sq1-slide').click(function(event){

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

        // Position slideshow slides.
        positionSlides($(this));

      });

      $( window ).resize(function() {

        // Loop through all SQ1 slideshows on this page.
        $('.sq1-slideshow').each(function(){

          // Position slideshow slides.
          positionSlides($(this));

        });

      });

    }
  };
})(jQuery, Drupal);
