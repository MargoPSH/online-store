'use strict';

(function($) {
    $(function() {
        let products = new Featured();
        let mycart = new Cart();

        $('.featured').on('click', '.cart-now', e => {
            mycart.addToCartProduct(e.target);
        });
        
        $('.container__tabs_control').on('click', 'button:not(.active)', event => {
            event.preventDefault();
            $(event.target).closest('.container__tabs_control').find('.active').removeClass('active');
            $(event.target).addClass('active').closest('.container__tabs').find('.text').hide();
            $($(event.target).find('a').attr('href')).fadeIn(500);
        })
    })
})(jQuery);