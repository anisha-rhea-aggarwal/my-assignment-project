(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix cart dropdown from closing
	$('.cart-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	// Filter products based on selected category from dropdown and/or sidebar and price range and brand
	// Filter products based on selected category from dropdown and/or sidebar and price range and brand
	function filterProducts() {
		var products = $('.product');
		var filterCategories = [];
		var filterBrands = [];
		var minPrice = parseFloat($('#price-min').val()) || 1;
		var maxPrice = parseFloat($('#price-max').val()) || 1900;

		// Add checked sidebar categories
		$('.category-checkbox input:checked').each(function() {
			var label = $(this).next('label').contents().filter(function() {
				return this.nodeType === 3;
			}).text().trim();
			filterCategories.push(label);
		});

		// Add checked sidebar brands
		$('.brand-checkbox input:checked').each(function() {
			var label = $(this).next('label').contents().filter(function() {
				return this.nodeType === 3;
			}).text().trim();
			filterBrands.push(label);
		});
		
		
		// --- START OF NEW FIX ---
		// Select the main product row
		var $storeProductsRow = $('#store .row').first();

		// Check if any filter is active
		var isFiltered = (filterCategories.length > 0 || 
						  filterBrands.length > 0 || 
						  minPrice !== 1 || 
						  maxPrice !== 1900);

		if (isFiltered) {
			// If filters are active, add a class to the row
			$storeProductsRow.addClass('is-filtered');
		} else {
			// If no filters, remove the class
			$storeProductsRow.removeClass('is-filtered');
		}
		// --- END OF NEW FIX ---


		// Filter products
		products.each(function() {
    	var product = $(this);
    	var wrapper = product.closest('.col-md-4.col-xs-6');

		var productCategory = product.find('.product-category').text().trim();
    	var productBrand = product.find('.product-brand').text().trim();
    	var productPriceText = product.find('.product-price').text();
    	var productPrice = parseFloat(productPriceText.replace(/[^\d.]/g, '')) || 0;

    	var categoryMatch = filterCategories.length === 0 || filterCategories.includes(productCategory);
    	var brandMatch = filterBrands.length === 0 || filterBrands.includes(productBrand);
    	var priceMatch = productPrice >= minPrice && productPrice <= maxPrice;

    	if (categoryMatch && brandMatch && priceMatch) {
        	wrapper.show();
    	} else {
        	wrapper.hide();
    	}	
	});

	}

	// Update breadcrumb based on current filter state
	function updateBreadcrumb() {
		var selectedCategory = $('.header-search select').val();
		var selectedText = $('.header-search select option:selected').text();
		var breadcrumbHtml = '<li><a href="#">Home</a></li>';
		var activeFilters = [];

		// Add dropdown selection if not "All Categories"
		if (selectedCategory !== '0') {
			activeFilters.push(selectedText);
		}

		// Add checked sidebar categories
		$('.input-checkbox input:checked').each(function() {
			var label = $(this).next('label').contents().filter(function() {
				return this.nodeType === 3;
			}).text().trim();
			activeFilters.push(label);
		});

		if (activeFilters.length === 0) {
			breadcrumbHtml += '<li class="active">All Categories</li>';
		} else if (activeFilters.length === 1) {
			breadcrumbHtml += '<li><a href="#">All Categories</a></li>';
			breadcrumbHtml += '<li class="active">' + activeFilters[0] + '</li>';
		} else {
			breadcrumbHtml += '<li><a href="#">All Categories</a></li>';
			breadcrumbHtml += '<li class="active">Filtered Categories</li>';
		}

		$('.breadcrumb-tree').html(breadcrumbHtml);
		// filterProducts(); // Removed to prevent hiding products on breadcrumb update
	}

	// Initialize breadcrumb on page load
	updateBreadcrumb();
	filterProducts();

	// Update breadcrumb on category change (if there's a header search select)
	// $('.header-search select').on('change', function() {
	// 	updateBreadcrumb();
	// });

	// Update filter on sidebar checkbox change
	$('.input-checkbox input').on('change', function() {
		updateBreadcrumb();
		filterProducts();
	});

	// Update filter on price submit button click
	$('#price-submit').on('click', function() {
		filterProducts();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	priceInputMax.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	priceInputMin.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [1, 1900],
			connect: true,
			step: 1,
			range: {
				'min': 1,
				'max': 1900
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
			filterProducts();
		});
	}

})(jQuery);
