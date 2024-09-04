$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var userDate = new Date(curDate.substr(6, 4), Number(curDate.substr(3, 2)) - 1, Number(curDate.substr(0, 2)));
                    if ($(element).attr('min')) {
                        var minDateStr = $(element).attr('min');
                        var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                        if (userDate < minDate) {
                            $.validator.messages['inputDate'] = 'Минимальная дата - ' + minDateStr;
                            return false;
                        }
                    }
                    if ($(element).attr('max')) {
                        var maxDateStr = $(element).attr('max');
                        var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                        if (userDate > maxDate) {
                            $.validator.messages['inputDate'] = 'Максимальная дата - ' + maxDateStr;
                            return false;
                        }
                    }
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input span').html('<em>' + curName + '<a href="#"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></em>');
            curField.addClass('full');
        } else {
            curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
            curField.removeClass('full');
        }
    });

    $('body').on('click', '.form-file-input span em a', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.removeClass('full');
        curField.find('input').val('');
        curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.header-menu-item-parent').click(function(e) {
        var curItem = $(this).parent();
        if (curItem.hasClass('open')) {
            curItem.removeClass('open');
            $('html').removeClass('header-submenu-open');
        } else {
            $('.header-menu-item.open').removeClass('open');
            curItem.addClass('open');
            $('html').addClass('header-submenu-open');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-menu-item').length == 0 || $(e.target).hasClass('header-submenu-popup') || $(e.target).hasClass('header-submenu-list')) {
            $('.header-menu-item.open').removeClass('open');
            $('html').removeClass('header-submenu-open');
        }
    });

    $('.header-submenu-popup-menu-item-parent').click(function(e) {
        var curItem = $(this).parent();
        var curParent = curItem.parents().filter('.header-menu-item');
        curParent.find('.header-submenu-popup-submenu').html('');
        curParent.find('.header-submenu-popup-menu-item.open').removeClass('open');
        curItem.addClass('open');
        curParent.find('.header-submenu-popup-submenu').html(curItem.find('.header-submenu-popup-menu-item-sub').html());
        e.preventDefault();
    });

    $('.header-submenu-popup-menu').each(function() {
        var curMenu = $(this);
        if (curMenu.find('.header-submenu-popup-menu-item.active').length == 1) {
            curMenu.find('.header-submenu-popup-menu-item.active .header-submenu-popup-menu-item-parent').trigger('click');
        } else {
            curMenu.find('.header-submenu-popup-menu-item').eq(0).find('.header-submenu-popup-menu-item-parent').trigger('click');
        }
    });

    $('.main-info-events-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider[0], {
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    });

    var timerGeo = false;
    var timerAutoGeo = false;
    var periodAutoGeo = 2000;

    $('.main-geo').each(function() {
        autoUpdateGeo();
    });

    function autoUpdateGeo() {
        var curIndex = -1;
        var curActive = $('.main-geo-map-item-center.open');
        if (curActive.length == 1) {
            curIndex = $('.main-geo-map-item-center').index(curActive);
        }
        curIndex++;
        if (curIndex > $('.main-geo-map-item-center').length - 1) {
            curIndex = 0;
        }
        $('.main-geo-map-item-center.open').removeClass('open');
        $('.main-geo-map-item-center').eq(curIndex).addClass('open');
        timerAutoGeo = window.setTimeout(function() {
            autoUpdateGeo();
        }, periodAutoGeo);
    }

    $('.main-geo-map-item-center').on('mouseenter', function() {
        if ($(window).width() > 1195) {
            window.clearTimeout(timerGeo);
            window.clearTimeout(timerAutoGeo);
            $('.main-geo-map-item-center.open').removeClass('open');
            $(this).addClass('open');
        }
    });

    $('.main-geo-map-item-center').on('mouseleave', function() {
        if ($(window).width() > 1195) {
            window.clearTimeout(timerGeo);
            timerGeo = window.setTimeout(function() {
                $('.main-geo-map-item-center.open').removeClass('open');
            }, 300);
        }
    });

    $('.main-geo-map-item-center').on('click', function() {
        if ($(window).width() < 1196) {
            window.clearTimeout(timerGeo);
            window.clearTimeout(timerAutoGeo);
            $('.main-geo-map-item-center.open').removeClass('open');
            $(this).addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(window).width() < 1196) {
            if ($(e.target).parents().filter('.main-geo-map-item-center').length == 0) {
                $('.main-geo-map-item-center.open').removeClass('open');
            }
        }
    });

    $('.main-clients-list').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider[0], {
            slidesPerView: 2,
            navigation: {
                nextEl: $('.main-clients-list-wrapper .swiper-button-next')[0],
                prevEl: $('.main-clients-list-wrapper .swiper-button-prev')[0],
            },
            breakpoints: {
                768: {
                    slidesPerView: 4
                },
                1196: {
                    slidesPerView: 6
                }
            },
        });
    });

    $('.services-card-page-menu').each(function() {
        var menuHTML =  '<div class="swiper">' +
                            '<div class="swiper-wrapper">';
        $('.services-card-section').each(function() {
            menuHTML +=         '<div class="swiper-slide"><div class="services-card-page-menu-item"><a href="#">' + $(this).find('.services-card-section-title').html() + '</a></div></div>';
        });
        $('.center-contacts').each(function() {
            menuHTML +=         '<div class="swiper-slide"><div class="services-card-page-menu-item services-card-page-menu-item-contacts"><a href="#">' + $(this).find('.center-contacts-info h2').html() + '</a></div></div>';
        });
        menuHTML +=         '</div>' +
                            '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#clients-prev"></use></svg></div>' +
                            '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#clients-next"></use></svg></div>' +
                        '</div>';
        $('.services-card-page-menu-inner').html(menuHTML);
        $('.services-card-page-menu-item').eq(0).addClass('active');
        new Swiper($('.services-card-page-menu .swiper')[0], {
            loop: false,
            slidesPerView: 'auto',
            freeMode: true,
            navigation: {
                nextEl: $('.services-card-page-menu-inner .swiper-button-next')[0],
                prevEl: $('.services-card-page-menu-inner .swiper-button-prev')[0],
            },
        });
    });

    $('body').on('click', '.services-card-page-menu-item a', function(e) {
        var curItem = $(this).parent();
        var curIndex = $('.services-card-page-menu-item').index(curItem);
        if (!curItem.hasClass('services-card-page-menu-item-contacts')) {
            var curBlock = $('.services-card-section').eq(curIndex);
        } else {
            var curBlock = $('.center-contacts');
        }
        if (curBlock.length == 1) {
            var newTop = curBlock.offset().top;
            if (newTop > $(window).scrollTop()) {
                newTop -= 104;
            } else {
                newTop -= 164;
            }
            if (curBlock.length == 1) {
                $('html, body').animate({'scrollTop': newTop});
            }
        }
        e.preventDefault();
    });

    $('.services-card-calc-item-count-dec').click(function(e) {
        var curItem = $(this).parents().filter('.services-card-calc-item');
        var curInput = curItem.find('.services-card-calc-item-count-inner input');
        var curValue = Number(curInput.val());
        var curMin = Number(curItem.attr('data-min'));
        if (typeof(curItem.attr('data-step')) != 'undefined') {
            curValue -= Number(curItem.attr('data-step'));
        } else {
            curValue--;
        }
        if (curValue < curMin) {
            curValue = curMin;
        }
        curInput.val(curValue);
        curItem.find('.services-card-calc-item-count-value').html(curValue);
        recalcServiceCard();
        e.preventDefault();
    });

    $('.services-card-calc-item-count-inc').click(function(e) {
        var curItem = $(this).parents().filter('.services-card-calc-item');
        var curInput = curItem.find('.services-card-calc-item-count-inner input');
        var curValue = Number(curInput.val());
        var curMax = Number(curItem.attr('data-max'));
        if (typeof(curItem.attr('data-step')) != 'undefined') {
            curValue += Number(curItem.attr('data-step'));
        } else {
            curValue++;
        }
        if (curValue > curMax) {
            curValue = curMax;
        }
        curInput.val(curValue);
        curItem.find('.services-card-calc-item-count-value').html(curValue);
        recalcServiceCard();
        e.preventDefault();
    });

    $('.services-card-calc-item-count-inner').each(function() {
        var curItem = $(this).parents().filter('.services-card-calc-item');
        curItem.find('.services-card-calc-item-count-value').html(curItem.find('.services-card-calc-item-count-inner input').val());
    });

    $('.services-card-calc-item-count-select-current').click(function() {
        var curSelect = $(this).parents().filter('.services-card-calc-item-count-select');
        if (curSelect.hasClass('open')) {
            curSelect.removeClass('open');
        } else {
            $('.services-card-calc-item-count-select.open').removeClass('open');
            curSelect.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.services-card-calc-item-count-select').length == 0) {
            $('.services-card-calc-item-count-select.open').removeClass('open');
        }
    });

    $('.services-card-calc-item-count-select-list label').click(function() {
        $('.services-card-calc-item-count-select.open').removeClass('open');
    });

    $('.services-card-calc-item-count-select-list input').change(function() {
        var curSelect = $(this).parents().filter('.services-card-calc-item-count-select');
        var curInput = curSelect.find('.services-card-calc-item-count-select-list input:checked');
        curSelect.find('.services-card-calc-item-count-select-current span').html(curInput.parent().find('span').html());
        var curItem = curSelect.parents().filter('.services-card-calc-item');
        curItem.find('.services-card-calc-item-price span').html(curInput.attr('data-price'));
        recalcServiceCard();
    });

    $('.services-card-calc-item-count-select-list input').each(function() {
        var curSelect = $(this).parents().filter('.services-card-calc-item-count-select');
        var curInput = curSelect.find('.services-card-calc-item-count-select-list input:checked');
        curSelect.find('.services-card-calc-item-count-select-current span').html(curInput.parent().find('span').html());
        var curItem = curSelect.parents().filter('.services-card-calc-item');
        curItem.find('.services-card-calc-item-price span').html(curInput.attr('data-price'));
    });

    $('.services-card-calc').each(function() {
        recalcServiceCard();
    });

    $('.tabs').each(function() {
        var curTabs = $(this);
        var menuHTML =  '<ul>';
        curTabs.find('> .tabs-container > .tabs-content').each(function() {
            menuHTML +=     '<li><a href="#">' + $(this).attr('data-title') + '</a></li>';
        });
        menuHTML +=     '</ul>';
        curTabs.find('> .tabs-menu').html(menuHTML);
        curTabs.find('> .tabs-menu li').eq(0).addClass('active');
        curTabs.find('> .tabs-container > .tabs-content').eq(0).addClass('active');
    });

    $('body').on('click', '.tabs-menu ul li a', function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            var curTabs = curItem.parent().parent().parent();
            curTabs.find('> .tabs-menu ul li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = curTabs.find('> .tabs-menu ul li').index(curItem);
            curTabs.find('> .tabs-container > .tabs-content.active').removeClass('active');
            curTabs.find('> .tabs-container > .tabs-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.faq-item-title').click(function() {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.faq-item-text').slideToggle(function() {
            $(window).trigger('resize');
        });
    });

    $('.centers-detail-info-gallery .swiper').each(function() {
        var curSlider = $(this);
        var options = {
            loop: true,
            slidesPerView: 1,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        };
        var swiper = new Swiper(curSlider[0], options);
    });

    $('body').on('click', '.center-contacts-path .tabs-menu ul li a', function(e) {
        $(window).trigger('resize');
        updateCenterRoute();
    });

    $('.holding-history').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 3,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0],
            },
            pagination: {
                el: curSlider.find('.swiper-pagination')[0],
                clickable: true
            },
            on : {
                slideChangeTransitionStart: function () {
                    if (swiper.realIndex % 2) {
                        $('.holding-history-logo').addClass('animated');
                    } else {
                        $('.holding-history-logo').removeClass('animated');
                    }
                    $('.holding-history-logo img').eq(0).css({'transform': 'rotate(' + (30 * swiper.realIndex) + 'deg)'});
                },
            }
        });
    });

    $('body').on('click', '[data-lightbox]', function(e) {
        var curItem = $(this);
        var curGroup = curItem.attr('data-lightbox');
        if (curGroup == '') {
            var curGallery = curItem;
        } else {
            var curGallery = $('[data-lightbox="' + curGroup + '"]');
        }
        var curIndex = curGallery.index(curItem);

        var curWidth = $(window).width();
        if (curWidth < 375) {
            curWidth = 375;
        }
        var curScroll = $(window).scrollTop();
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-photo-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css({'top': -curScroll});

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-preview swiper">' +
                                    '<div class="window-photo-preview-list swiper-wrapper">';

        var galleryLength = curGallery.length;

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-preview-list-item swiper-slide"><a href="#" style="background-image:url(' + curGalleryItem.find('img').attr('src') + ')"></a></div>';
        }
        windowHTML +=               '</div>' +
                                    '<div class="swiper-scrollbar"></div>' +
                                '</div>';

        windowHTML +=           '<div class="window-photo-slider swiper">' +
                                    '<div class="window-photo-slider-list swiper-wrapper">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item swiper-slide">' +
                                            '<div class="window-photo-slider-list-item-inner"><img alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZC0xIiB5Mj0iMSIgeDI9IjAiPgogICAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iNSUiIHN0b3AtY29sb3I9IiMwMEFFRUYiIHN0b3Atb3BhY2l0eT0iMC41IiAvPgogICAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwQUVFRiIgc3RvcC1vcGFjaXR5PSIwLjAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQtMiIgeTI9IjEiIHgyPSIwIj4KICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjUlIiBzdG9wLWNvbG9yPSIjMDBBRUVGIiBzdG9wLW9wYWNpdHk9IjAuMCIgLz4KICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMEFFRUYiIHN0b3Atb3BhY2l0eT0iMS4wIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZC0xKSIgLz4KICAgICAgICAgICAgICA8cmVjdCB4PSI1MCUiIHk9IjAiIHdpZHRoPSI1MCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkLTIpIiAvPgogICAgICAgIDwvcGF0dGVybj4KICAgIDwvZGVmcz4KCiAgICA8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMy43NSIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZT0idXJsKCNwYXR0ZXJuKSI+CiAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiB2YWx1ZXM9IjAgMTUgMTU7MzYwIDE1IDE1IiBrZXlUaW1lcz0iMDsxIj48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgICA8L2NpcmNsZT4KCiAgICA8ZWxsaXBzZSBjeD0iMTUiIGN5PSIyOC43NSIgcng9IjEuMjUiIHJ5PSIxLjI1IiBmaWxsPSIjMDBBRUVGIj4KICAgICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMXMiIHZhbHVlcz0iMCAxNSAxNTszNjAgMTUgMTUiIGtleVRpbWVzPSIwOzEiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICAgIDwvZWxsaXBzZT4KPC9zdmc+" data-src="' + curGalleryItem.attr('href') + '" /></div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                    '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></div>' +
                                    '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';
        windowHTML +=           '<a href="#" class="window-photo-download" target="_blank" download><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-download"></use></svg></a>';
        windowHTML +=           '<div class="window-photo-count"><span>' + (curIndex + 1) + '</span>&nbsp;/&nbsp;' + galleryLength + '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);
        $('.window-photo-preview-list-item').eq(curIndex).addClass('active');

        $('.window-photo-slider').each(function() {
            var curSlider = $(this);

            var thumbsSwiper = new Swiper('.window-photo-preview', {
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
                scrollbar: {
                    el: '.swiper-scrollbar',
                }
            });

            var swiper = new Swiper(curSlider[0], {
                loop: false,
                initialSlide: curIndex,
                touchAngle: 30,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                thumbs: {
                    swiper: thumbsSwiper,
                },
                on: {
                    afterInit: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        $('.window-photo-download').attr('href', curIMG.attr('data-src'));
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    },
                    slideChangeTransitionStart: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');
                        if (typeof(swiper) != 'undefined') {
                            $('.window-photo-count span').html(swiper.activeIndex + 1);
                            $('.window-photo-preview-list-item.active').removeClass('active');
                            $('.window-photo-preview-list-item').eq(swiper.activeIndex).addClass('active');
                        }

                        var curIMG = currentSlide.find('img');
                        $('.window-photo-download').attr('href', curIMG.attr('data-src'));
                    },
                    slideChangeTransitionEnd: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    }
                }
            });

            $('.window-photo-preview-list-item a').click(function(e) {
                var curItem = $(this).parent();
                if (!curItem.hasClass('active')) {
                    var curIndex = $('.window-photo-preview-list-item').index(curItem);
                    if (typeof(swiper) != 'undefined') {
                        swiper.slideTo(curIndex);
                    }
                }
                e.preventDefault();
            });
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('body').on('click', '.video-link', function(e) {
        var curLink = $(this);

        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-video-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        var windowHTML =    '<div class="window-video">';

        windowHTML +=           '<a href="#" class="window-video-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';

        var videoLink = curLink.attr('href');
        if (videoLink.indexOf('?') != -1) {
            videoLink += '&amp;rel=0&amp;autoplay=1';
        } else {
            videoLink += '?rel=0&amp;autoplay=1';
        }

        windowHTML +=           '<div class="window-video-player"><iframe width="560" height="315" src="' + videoLink + '" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';

        windowHTML +=       '</div>';

        $('.window-video').remove();
        $('body').append(windowHTML);

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        e.preventDefault();
    });

    $('body').on('click', '.window-video-close', function(e) {
        $('.window-video').remove();
        $('html').removeClass('window-video-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-video').length > 0) {
                $('.window-video-close').trigger('click');
            }
        }
    });

    $('.presentations-filter select').change(function() {
        var curValue = $(this).val();
        var curBlock = $(this).parents().filter('.presentations-filter').parent();
        curBlock.find('.presentations-group.hidden').removeClass('hidden');
        curBlock.find('.licenses-group.hidden').removeClass('hidden');
        if (curValue != '0') {
            $('.licenses-section-title').addClass('hidden');
            curBlock.find('.presentations-group').addClass('hidden');
            curBlock.find('.presentations-group[data-id="' + curValue + '"]').removeClass('hidden');
            curBlock.find('.licenses-group').addClass('hidden');
            curBlock.find('.licenses-group[data-id="' + curValue + '"]').removeClass('hidden');
        } else {
            $('.licenses-section-title').removeClass('hidden');
        }
    });

    $('.licenses-filter select').change(function() {
        var curValue = $(this).val();
        var curBlock = $(this).parents().filter('.licenses-filter').parent();
        curBlock.find('.presentations-group.hidden').removeClass('hidden');
        curBlock.find('.licenses-group.hidden').removeClass('hidden');
        if (curValue != '0') {
            $('.licenses-section-title').addClass('hidden');
            curBlock.find('.presentations-group').addClass('hidden');
            curBlock.find('.presentations-group[data-id="' + curValue + '"]').removeClass('hidden');
            curBlock.find('.licenses-group').addClass('hidden');
            curBlock.find('.licenses-group[data-id="' + curValue + '"]').removeClass('hidden');
        } else {
            $('.licenses-section-title').removeClass('hidden');
        }
    });

    $('.presentations-filter select').each(function() {
        var curValue = $(this).val();
        var curBlock = $(this).parents().filter('.presentations-filter').parent();
        curBlock.find('.presentations-group.hidden').removeClass('hidden');
        curBlock.find('.licenses-group.hidden').removeClass('hidden');
        if (curValue != '0') {
            $('.licenses-section-title').addClass('hidden');
            curBlock.find('.presentations-group').addClass('hidden');
            curBlock.find('.presentations-group[data-id="' + curValue + '"]').removeClass('hidden');
            curBlock.find('.licenses-group').addClass('hidden');
            curBlock.find('.licenses-group[data-id="' + curValue + '"]').removeClass('hidden');
        } else {
            $('.licenses-section-title').removeClass('hidden');
        }
    });

    $('.licenses-filter select').each(function() {
        var curValue = $(this).val();
        var curBlock = $(this).parents().filter('.licenses-filter').parent();
        curBlock.find('.presentations-group.hidden').removeClass('hidden');
        curBlock.find('.licenses-group.hidden').removeClass('hidden');
        if (curValue != '0') {
            $('.licenses-section-title').addClass('hidden');
            curBlock.find('.presentations-group').addClass('hidden');
            curBlock.find('.presentations-group[data-id="' + curValue + '"]').removeClass('hidden');
            curBlock.find('.licenses-group').addClass('hidden');
            curBlock.find('.licenses-group[data-id="' + curValue + '"]').removeClass('hidden');
        } else {
            $('.licenses-section-title').removeClass('hidden');
        }
    });

    $('.content-gallery').each(function() {
        var curGallery = $(this);
        var startIndex = curGallery.find('.swiper-slide').length - 2;
        curGallery.find('.swiper-wrapper').append(
            curGallery.find('.swiper-wrapper').html() +
            curGallery.find('.swiper-wrapper').html() +
            curGallery.find('.swiper-wrapper').html() +
            curGallery.find('.swiper-wrapper').html() +
            curGallery.find('.swiper-wrapper').html()
        );
        var swiper = new Swiper(curGallery.find('.swiper')[0], {
            loop: true,
            slidesPerView: 5,
            initialSlide: startIndex,
            navigation: {
                nextEl: curGallery.find('.swiper-button-next')[0],
                prevEl: curGallery.find('.swiper-button-prev')[0],
            },
        });
    });

    $('.header-search-link').click(function(e) {
        $('html').addClass('header-search-open');
        $('.header-search-input input').trigger('focus');
        e.preventDefault();
    });

    $('.header-search-close').click(function(e) {
        $('html').removeClass('header-search-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-search').length == 0 && $(e.target).parents().filter('.header-search-window').length == 0 && !$(e.target).hasClass('header-search-window')) {
            $('html').removeClass('header-search-open');
        }
    });

});

$.fn.datepicker.language['ru'] =  {
    days: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    daysShort: ['Вос','Пон','Вто','Сре','Чет','Пят','Суб'],
    daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthsShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'hh:ii',
    firstDay: 1
};

function initForm(curForm) {
    curForm.find('input.phoneRU').attr('autocomplete', 'off');
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input-date input').mask('00.00.0000');
    curForm.find('.form-input-date input').attr('autocomplete', 'off');
    curForm.find('.form-input-date input').addClass('inputDate');
    curForm.find('.form-input-date-range input').prop('readonly', true);
    curForm.find('.form-input-date-range input').attr('autocomplete', 'off');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });
    curForm.find('.form-input input, .form-input textarea').blur(function(e) {
        $(this).parent().removeClass('focus');
        if ($(this).val() == '') {
            $(this).parent().removeClass('full');
        } else {
            $(this).parent().addClass('full');
        }
        if (e.originalEvent !== undefined && $(e.originalEvent.relatedTarget).hasClass('form-input-clear')) {
            $(this).parent().find('.form-input-clear').trigger('click');
        }
    });

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
        $(this).on('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    curForm.find('input[autofocus]').trigger('focus');

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 10,
            closeOnSelect: false
        };
        if (typeof(curSelect.attr('data-searchplaceholder')) != 'undefined') {
            options['searchInputPlaceholder'] = curSelect.attr('data-searchplaceholder');
        } else {
            curSelect.parent().addClass('no-placeholder');
        }
        curSelect.select2(options);
        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.parent().find('.select2-selection__rendered').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            $(e.delegateTarget).parent().find('.select2-search--inline input').val('').trigger('input.search').trigger('focus');
            $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
        });
        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                $(e.delegateTarget).parent().find('.select2-container').removeClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-placeholder'));
            } else {
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
            }
        });
        curSelect.on('select2:close', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                $(e.delegateTarget).parent().find('.select2-container').removeClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-placeholder'));
            }
        });
        if (typeof(curSelect.attr('multiple')) != 'undefined') {
            curSelect.on('select2:open', function(e) {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', '');
            });
        }
        if (curSelect.find('option:selected').length > 0 && curSelect.find('option:selected').html() != '') {
            curSelect.trigger({type: 'select2:select'})
        }
    });

    curForm.find('.form-input-date input').on('change', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            var isCorrectDate = true;
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                }
            } else {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    myDatepicker.clear();
                }
            }
        }
    });

    curForm.find('.form-input-date input').on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    curForm.find('.form-input-date input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            autoClose: true,
            toggleSelected: false,
            prevHtml: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L5 8L10 13" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>',
            nextHtml: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L10 8L5 3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>'
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });

    curForm.find('.form-input-date-range input').each(function() {
        var curInput = $(this);
        var minDateText = curInput.attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = curInput.attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        curInput.datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            range: true,
            multipleDatesSeparator: ' – ',
            prevHtml: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L5 8L10 13" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>',
            nextHtml: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L10 8L5 3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>',
            onSelect: function(date, formattedDate, datepicker) {
                curInput.trigger('change');
            }
        });
    });

    window.setInterval(function() {
        $('.form-input-date input, .form-input-date-range input').each(function() {
            if ($(this).val() != '') {
                $(this).parent().addClass('focus');
            }
        });
    }, 100);

    curForm.find('.captcha-container').each(function() {
        if ($('script#smartCaptchaScript').length == 0) {
            $('body').append('<script src="https://captcha-api.yandex.ru/captcha.js?render=onload&onload=smartCaptchaLoad" defer id="smartCaptchaScript"></script>');
        } else {
            if (window.smartCaptcha) {
                var curID = window.smartCaptcha.render(this, {
                    sitekey: smartCaptchaKey,
                    callback: smartCaptchaCallback,
                    invisible: true,
                    hideShield: true,
                    hl: 'ru'
                });
                $(this).attr('data-smartid', curID);
            }
        }
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);

            var smartCaptchaWaiting = false;
            curForm.find('.captcha-container').each(function() {
                if (curForm.attr('form-smartcaptchawaiting') != 'true') {
                    var curBlock = $(this);
                    var curInput = curBlock.find('input[name="smart-token"]');
                    curInput.removeAttr('value');
                    smartCaptchaWaiting = true;
                    $('form[form-smartcaptchawaiting]').removeAttr('form-smartcaptchawaiting');
                    curForm.attr('form-smartcaptchawaiting', 'false');

                    if (!window.smartCaptcha) {
                        alert('Сервис временно недоступен, попробуйте позже.');
                        return;
                    }
                    var curID = $(this).attr('data-smartid');
                    window.smartCaptcha.execute(curID);
                } else {
                    curForm.removeAttr('form-smartcaptchawaiting');
                }
            });

            if (!smartCaptchaWaiting) {

                if (curForm.hasClass('ajax-form')) {
                    curForm.addClass('loading');
                    var formData = new FormData(form);

                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: formData,
                        cache: false
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        curForm.find('.message').remove();
                        curForm.append('<div class="message message-error">Сервис временно недоступен, попробуйте позже.</div>')
                        curForm.removeClass('loading');
                    }).done(function(data) {
                        curForm.find('.message').remove();
                        if (data.status) {
                            curForm.html('<div class="message message-success">' + data.message + '</div>')
                        } else {
                            curForm.prepend('<div class="message message-error">' + data.message + '</div>')
                        }
                        curForm.removeClass('loading');
                    });
                } else {
                    form.submit();
                }
            }
        }
    });
}

var smartCaptchaKey = 'uahGSHTKJqjaJ0ezlhjrbOYH4OxS6zzL9CZ47OgY';

function smartCaptchaLoad() {
    $('.captcha-container').each(function() {
        if (!window.smartCaptcha) {
            return;
        }
        var curID = window.smartCaptcha.render(this, {
            sitekey: smartCaptchaKey,
            callback: smartCaptchaCallback,
            invisible: true,
            hideShield: true
        });
        $(this).attr('data-smartid', curID);
    });
}

function smartCaptchaCallback(token) {
    $('form[form-smartcaptchawaiting]').attr('form-smartcaptchawaiting', 'true');
    $('form[form-smartcaptchawaiting] [type="submit"]').trigger('click');
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curWidth = $(window).width();
        if (curWidth < 375) {
            curWidth = 375;
        }
        var curScroll = $(window).scrollTop();
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css({'top': -curScroll});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowClose() {
    if ($('.window').length > 0) {

        var isEmptyForm = true;
        $('.window .form-input input, .window .form-input textarea, .window .form-select select').each(function() {
            if ($(this).val() != '') {
                isEmptyForm = false;
            }
        });
        if (isEmptyForm) {
            $('.window').remove();
            $('html').removeClass('window-open');
            $('body').css({'margin-right': 0});
            $('.wrapper').css({'top': 0});
            $('meta[name="viewport"]').attr('content', 'width=device-width');
            $(window).scrollTop($('html').data('scrollTop'));
        } else {
            if (confirm('Закрыть форму?')) {
                $('.window .form-input input, .window .form-input textarea, .window .form-select select').val('');
                windowClose();
            }
        }
    }
}

function recalcServiceCard() {
    var curSumm = 0;
    $('.services-card-calc-item').each(function() {
        var curItem = $(this);
        if (curItem.find('.services-card-calc-item-count-inner').length == 1) {
            var curPrice = Number(curItem.attr('data-price').replace(',', '.').replace(' ', ''));
            if (Number.isNaN(curPrice)) {
                curPrice = 0;
            }
            var curCount = 1;
            if (curItem.find('.services-card-calc-item-count-value').length == 1) {
                curCount = Number(curItem.find('.services-card-calc-item-count-value').html());
            }
            var itemSumm = (curPrice * curCount).toFixed(2);
            var itemSummParts = itemSumm.split('.');
            itemSummParts[0] = itemSummParts[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;');
            curItem.find('.services-card-calc-item-price span').html(itemSummParts.join(','));

            curSumm += curPrice * curCount;
        }
        if (curItem.find('.services-card-calc-item-count-select').length == 1) {
            var curPrice = Number(curItem.find('.services-card-calc-item-price span').html().replace(',', '.').replace(' ', ''));
            if (Number.isNaN(curPrice)) {
                curPrice = 0;
            }
            curSumm += curPrice;
        }
    });
    curSumm = curSumm.toFixed(2);
    var curSummParts = curSumm.split('.');
    curSummParts[0] = curSummParts[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;');
    $('.services-card-calc-summ-value span').html(curSummParts.join(','));
}

$(window).on('load resize', function() {
    $('.vacancies-group-city').each(function() {
        var curGroup = $(this).parent();
        curGroup.find('.vacancies-group-city').css({'min-height': '0'});
        curGroup.find('.vacancies-group-city').css({'min-height': curGroup.find('.vacancies-group-city-inner').height() + 'px'});
    });

    $('.services-card-menu').each(function() {
        $('.services-card-menu').css({'min-height': '0'});
        $('.services-card-menu').css({'min-height': $('.services-card-menu-inner').height() + 'px'});
    });

    $('.services-card-page-menu').each(function() {
        $('.services-card-page-menu-inner').css({'max-width': $('.services-card-page-menu').width() + 'px'});
        $('.services-card-page-menu').css({'min-height': '0'});
        $('.services-card-page-menu').css({'min-height': $('.services-card-page-menu-inner').height() + 'px'});
    });

    $('.center-contacts').each(function() {
        var heightInfo = $('.center-contacts-info').outerHeight();
        var heightPath = $('.center-contacts-path').outerHeight();
        var curMax = heightInfo;
        if (heightPath > curMax) {
            curMax = heightPath;
        }
        $('.center-contacts').css({'height': curMax + 66});
        if (myMap) {
            myMap.container.fitToViewport();
        }
    });

    $('.content-gallery-list').each(function() {
        var curGallery = $(this);
        var newMargin = -($('.wrapper').width() - $('.container').eq(0).width()) / 2;
        curGallery.css({'margin-left': newMargin + 'px', 'margin-right': newMargin + 'px'});
    });
});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();

    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if (windowScroll > 0) {
        $('header').addClass('fixed')
    } else {
        $('header').removeClass('fixed')
    }

    $('.vacancies-group-city').each(function() {
        var curGroup = $(this).parent();
        if (windowScroll + 112 > curGroup.offset().top) {
            curGroup.find('.vacancies-group-city').addClass('fixed');
            if (windowScroll + 112 + curGroup.find('.vacancies-group-city').height() > curGroup.offset().top + curGroup.height()) {
                curGroup.find('.vacancies-group-city-inner').css({'margin-top': (curGroup.offset().top + curGroup.height()) - (windowScroll + 112 + curGroup.find('.vacancies-group-city-inner').height())});
            } else {
                curGroup.find('.vacancies-group-city-inner').css({'margin-top': 0});
            }
        } else {
            curGroup.find('.vacancies-group-city').removeClass('fixed');
            curGroup.find('.vacancies-group-city-inner').css({'margin-top': 0});
        }
    });

    $('.services-card-menu').each(function() {
        var curGroup = $('.services-card');
        if (windowScroll + 92 > curGroup.offset().top) {
            curGroup.find('.services-card-menu').addClass('fixed');
            if (windowScroll + 92 + curGroup.find('.services-card-menu').height() > curGroup.offset().top + curGroup.height()) {
                curGroup.find('.services-card-menu-inner').css({'margin-top': (curGroup.offset().top + curGroup.height()) - (windowScroll + 92 + curGroup.find('.services-card-menu-inner').height())});
            } else {
                curGroup.find('.services-card-menu-inner').css({'margin-top': 0});
            }
        } else {
            curGroup.find('.services-card-menu').removeClass('fixed');
            curGroup.find('.services-card-menu-inner').css({'margin-top': 0});
        }
    });

    $('.services-card-page-menu').each(function() {
        var curGroup = $('.services-card');
        if (windowScroll + 92 > curGroup.offset().top) {
            curGroup.find('.services-card-page-menu').addClass('fixed');
            if (windowScroll + 92 + curGroup.find('.services-card-page-menu').height() > curGroup.offset().top + curGroup.height()) {
                curGroup.find('.services-card-page-menu-inner, .services-card-page-menu-shadow').css({'margin-top': (curGroup.offset().top + curGroup.height()) - (windowScroll + 92 + curGroup.find('.services-card-page-menu-inner').height())});
            } else {
                curGroup.find('.services-card-page-menu-inner, .services-card-page-menu-shadow').css({'margin-top': 0});
            }
        } else {
            curGroup.find('.services-card-page-menu').removeClass('fixed');
            curGroup.find('.services-card-page-menu-inner, .services-card-page-menu-shadow').css({'margin-top': 0});
        }
    });

    $('.services-card-page-menu-item a').each(function() {
        var curItem = $(this).parent();
        var curIndex = $('.services-card-page-menu-item').index(curItem);
        if (!curItem.hasClass('services-card-page-menu-item-contacts')) {
            var curBlock = $('.services-card-section').eq(curIndex);
        } else {
            var curBlock = $('.center-contacts');
        }
        if (curBlock.length == 1) {
            if ((windowScroll + windowHeight / 2) > curBlock.offset().top) {
                $('.services-card-page-menu-item.active').removeClass('active');
                curItem.addClass('active');
            }
        }
    });
});

var lastScrollTop = 0;
var didScroll = false;
var delta = 5;

$(window).on('scroll', function() {
    didScroll = true;
    window.setInterval(function() {
        if (didScroll) {
            var st = $(window).scrollTop();
            if (Math.abs(lastScrollTop - st) <= delta) {
                return;
            }
            if (st > lastScrollTop && st > $('header').height()) {
                $('html').addClass('header-up');
            } else {
                if (st + $(window).height() < $(document).height()) {
                    $('html').removeClass('header-up');
                }
            }
			lastScrollTop = st;
            didScroll = false;
        }
    }, 50);
});

function updateCenterRoute() {
    if (myMap) {
        var curActive = $('.center-contacts-path .tabs-content.active');
        myMap.geoObjects.removeAll();
        var curCoords = curActive.attr('data-coords').replace(' ', '').split(',');
        ymaps.route([
            curCoords,
            coords
        ], {
            mapStateAutoApply: false
        }).then(function (route) {
            myMap.geoObjects.add(route);
        });
    }
}