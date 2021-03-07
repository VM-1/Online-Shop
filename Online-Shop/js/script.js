	function testWebP(callback) {

var webP = new Image();
webP.onload = webP.onerror = function () {
callback(webP.height == 2);
};
webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

if (support == true) {
document.querySelector('body').classList.add('webp');
}else{
document.querySelector('body').classList.add('no-webp');
}
});
	let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
let body = document.querySelector('body');
let menuItem = document.querySelectorAll('.menu__item');
let menuItemActive = document.querySelectorAll('.menu_active');
let menu = document.querySelectorAll('.menu');

if(isMobile.any()){
	body.classList.add('touch');
	let arrow = document.querySelectorAll('.menu__arrow');
	if (arrow) {
		for(i=0; i<arrow.length; i++){
			let thisLink=arrow[i].previousElementSibling;
			let subMenu=arrow[i].nextElementSibling;
			let thisArrow=arrow[i];
			thisLink.classList.add('parent');
			arrow[i].addEventListener('click', function(){
				if (thisArrow.parentNode.classList.contains("menu__item")){
					subMenuClose(menuItem,subMenu);
				}
				subMenuPos(menuItem);
				subMenu.classList.toggle('_open');
				thisArrow.classList.toggle('_active');
			});
		}
	}
}else{
	body.classList.add('mouse');
}

let menuBurger = document.querySelector('.menu__item-burger');
if (menuBurger) {
	menuBurger.addEventListener('click', function(e) {
		event.preventDefault();
		let menuBurgerParent = menuBurger.parentNode;
		subMenuClose(menuItem,menuBurgerParent.querySelector('.sub-menu'));
		subMenuPos(menuItem,menu);
		menuBurgerParent.querySelector('.sub-menu').classList.toggle("_open");
		menuBurgerParent.querySelector('.menu__arrow').classList.toggle("_active");
		document.querySelector('.body').classList.remove('lock');
	});
}

if (menuItemActive.length > 0) {
	menuItemActive.forEach(elem =>  {
		elem.addEventListener('mousemove', function(e) {
			subMenuPos(menuItem);
		});
	});
}

function subMenuClose(menuItem,thisSubMenu) {
	if (!thisSubMenu.classList.contains("_open")) {
		menuItem.forEach(elem => {
			if (elem)
			elem.querySelector('.sub-menu').classList.remove('_open');
			elem.querySelector('.menu__arrow').classList.remove('_active');
		});
	}
}

function subMenuPos(menuItem) {
	menuItem.forEach(elem => {
		let elemPosLeft = elem.offsetLeft;
		elem.querySelector('.sub-menu').style.left = `${elemPosLeft}px`;
	});
}
	class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({
        breakpoint
      }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
      );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
const da = new DynamicAdapt("max");  
da.init();
	const categorySlider = new Swiper('.category__main', {
    wrapperClass: "category__main-wrapper",
    speed: 500,
    slideClass: "category-product",
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: '.category__btn_next',
      prevEl: '.category__btn_prev',
    },
     breakpoints: {
      // when window width is >= 320px
      450: {
        slidesPerView: 1.4,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // when window width is >= 640px
      1340: {
        slidesPerView: 4,
        spaceBetween: 40
      },
      1440: {
        slidesPerView: "auto",
        spaceBetween: 40
      }
    }
})
const heroSlider = new Swiper('.hero', {
    wrapperClass: "hero__wrapper",
    speed: 800,
    slideClass: "hero__item",
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
    delay: 2000,
    navigation: {
      nextEl: '.hero__btn_next',
      prevEl: '.hero__btn_prev',
    },
    pagination: {
      el: '.hero__dots',
      type: 'bullets',
      clickable: true,
      bulletClass: 'hero__dot',
      bulletActiveClass: 'hero__dot_active',
    },
})
	const anchors = document.querySelectorAll('.anchor');
if (anchors.length > 0) {
	anchors.forEach(anchor => {
		anchor.addEventListener("click",function(event) {
			event.preventDefault();
			const blockID = anchor.getAttribute('href')
			document.querySelector('' +blockID).scrollIntoView({
				behavior:"smooth",
				block: "start"
			})
		})
	});
}

let pageUp = document.querySelector('.page-up');
// pageUp.addEventListener('click', function(e) {
// 	event.preventDefault();
// });
if (pageUp) {
	window.addEventListener('scroll', pageUpShow);
}

function pageUpShow() {
	let clientHeight = document.body.clientHeight;
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	if (scrollTop >= clientHeight/2) {
		pageUp.classList.add('_active');
	}else {
		pageUp.classList.remove('_active');
	}
}

	const popupLinks = document.querySelectorAll('.popup-link');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('_open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('_open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup._open');
		popupClose(popupActive);
	}
});

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();

	function offset(el) {
	const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}


// ************************Search start******************
let burgerMenu = document.querySelector(".burger-menu")
let search = document.querySelector(".search")
let searchLink = document.querySelector('.search-link');
if (searchLink) {
	searchLink.addEventListener('click', function(e) {
		event.preventDefault();
		if (bodyLockCheck(burgerMenu)){
			burgerMenu.classList.remove('_active');
		} else {
			document.querySelector('.body').classList.toggle('lock');
		}
		search.classList.toggle('_active');
	});
}


let searchClose= document.querySelector('.search__close');
if (searchClose) {
	searchClose.addEventListener('click', function(e) {
		event.preventDefault();
		document.querySelector('.search').classList.remove('_active');
		document.querySelector('.search__input').value = "";
		document.querySelector('.search__drop').classList.remove('_active');
		document.querySelector('.search__header').classList.remove('_active');
		document.querySelector('.body').classList.remove('lock');
	});
}

searchInput = document.querySelector('.search__input');
if (searchInput) {
	searchInput.oninput = function() {
		let val = this.value.trim();
		if (val) {
			document.querySelector('.search__drop').classList.add('_active');
			document.querySelector('.search__header').classList.add('_active');
		} else {
			document.querySelector('.search__drop').classList.remove('_active');
			document.querySelector('.search__header').classList.remove('_active');
		}
	}
}
// ************************Search end******************

// ************************Burger start******************

let burgerMenuIcon = document.querySelector(".burger__icon");
if (burgerMenuIcon) {
	burgerMenuIcon.addEventListener("click", function(){
		if (bodyLockCheck(search)){
			search.classList.remove('_active');
		} else {
			document.querySelector('.body').classList.toggle('lock');
		}
		burgerMenu.classList.toggle('_active');
	})
}

let burgerMenuArrow = document.querySelectorAll('.burger-menu__arrow');
if (burgerMenuArrow.length > 0) {
	burgerMenuArrow.forEach(elem => {
		elem.addEventListener('click', function(e) {
			let burgerSubMenu = elem.parentNode.nextElementSibling;
			if (burgerSubMenu.parentNode.classList.contains("_active")) {
				burgerSubMenu.style.maxHeight = "0px";
				burgerSubMenu.parentNode.classList.remove("_active")
			} else {
				burgerSubMenu.style.maxHeight = burgerSubMenu.scrollHeight + "px";
				burgerSubMenu.parentNode.classList.add("_active")
			}
		});
	});
}


function bodyLockCheck(elem) {
	if (elem.classList.contains('_active')) {
		return true
	} else {
		return false
	}
}
// ************************Burger end******************


// ***********************Product to Cart start*****************

// let favorive = document.querySelectorAll('.product__favorite');
// let cart = document.querySelector('.cart');
// let productCopy = document.querySelector('.product-copy');
// let productCopyImg = productCopy.querySelector('img');
// let productCopySource = productCopy.querySelector('source');
// if (favorive.length > 0 && cart) {
// 	favorive.forEach(elem => {
// 		elem.addEventListener('click', function(e) {
// 			let cartPos = getCoords(cart) + cart.width / 2;
// 			console.log(cartPos);
// 			favoriteParent = elem.closest('.product');
// 			let productImg = favoriteParent.querySelector('.product__img img');
// 			let productImgSrc = productImg.getAttribute("src");
// 			productCopyImg.setAttribute("src",productImgSrc);
// 			if (productCopySource) {
// 				productCopySource.setAttribute("srcset",productImgSrc);
// 			};
// 			productCopy.style.width = `${productImg.width}px`;
// 			productCopy.style.height = `${productImg.height}px`;
// 			// productCopy.style.top = `${productPosTop}px`;
// 			// productCopy.style.left = `${productPosLeft}px`;
// 		});
// 	});
// }



// ***********************Product to Cart end*****************