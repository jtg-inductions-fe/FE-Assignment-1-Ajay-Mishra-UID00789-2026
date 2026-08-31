/* global $ */

$(document).ready(function () {
    $('.testimonials__slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        prevArrow: $('.testimonials__control--prev'),
        nextArrow: $('.testimonials__control--next'),
    });
});
