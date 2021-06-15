// $(document).ready(function(){
//     var $header = $("#header");
//     $(window).scroll(function(){
//         if ( $(this).scrollTop() > 100 && $header.hasClass("default") ){
//             $header.fadeOut('fast',function(){
//                 $(this).removeClass("default")
//                         .addClass("fixed")
//                         .fadeIn('fast');
//             });
//         } else if($(this).scrollTop() <= 100 && $header.hasClass("fixed")) {
//             $header.fadeOut('fast',function(){
//                 $(this).removeClass("fixed")
//                         .addClass("default")
//                         .fadeIn('fast');
//             });
//         }
//     }); 
    
//     $('.product__img-slick').slick({
//         dots: false,
//         infinite: true,
//         arrows: true,
//         prevArrow: '<button type="button" class="slick-prev"><img src="/image/arrow-left.svg"></button>',
//         nextArrow: '<button type="button" class="slick-next"><img src="/image/arrow-right.svg"></button>',
//         speed: 300,
//         slidesToScroll: 1,
//         slidesToShow: 3
//     });
           
// });


window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    if (window.pageYOffset > 100 && header.classList.contains("default")) {
        header.classList.remove("default");
        header.classList.add("fixed");

    }
    if (window.pageYOffset <= 100 && header.classList.contains("fixed")) {
        header.classList.remove("fixed");
        header.classList.add("default");

    }
});

var expandImg = document.getElementById("expandedImg");
var imgs = document.querySelectorAll('.enterImg');
//expandImg.src = imgs[1].src;
imgs.forEach(function(item) {
    item.addEventListener('click', function(elem) {
        expandImg.src = elem.target.src;
    });
});


var menuToggle = document.getElementById('menu__toggle');

window.addEventListener('popstate', function() {
    if (menuToggle) menuToggle.checked = false;
});

menuToggle.addEventListener("change", function(e) {
    if (this.checked) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "scroll";
    }
});


var slider = tns({
    container: '.product__img-slick',
    items: 3,
    gutter: 5,
    nav: false,
    prevButton: '.slick-prev',
    nextButton: '.slick-next',
    loop: false,

    responsive: {
      640: {
        gutter: 20,

      }
    }
});



