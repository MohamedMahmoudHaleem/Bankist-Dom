'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section = document.querySelectorAll('section');
const section1 = document.getElementById('section--1');

const secton2 = document.getElementById('section--2');
const secton3 = document.getElementById('section--3');
const nav = document.querySelector('.nav');
//ul---> navLinks
const navLinksUl = document.querySelector('.nav__links');
//a --->navLink
const navLinkAnchor = document.querySelectorAll('.nav__link');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(openBtn => openBtn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////
/////page navigation.

btnScrollTo.addEventListener('click', function (e) {
  //current bounding rect calc from visiable viewport .
  const s1coord = section1.getBoundingClientRect();
  console.log(s1coord);
  //  current clicked element bounding rect .
  console.log(e.target.getBoundingClientRect());
  ///current scroll position from viewport .
  console.log(`x-offset :y--offset `, window.pageXOffset, pageYOffset);

  //current height and width form point of visiable viewport.
  console.log(
    'height , width ',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //scrolling__oldWay
  // window.scrollTo(
  //   s1coord.left + window.pageXOffset,
  //   s1coord.top + window.pageYOffset
  // );

  // enhancement ,
  /*
  window.scrollTo({
    left: s1coord.left + window.pageXOffset,
    top: s1coord.top + window.pageYOffset,
    behavior: 'smooth',
  });
*/
  //modernWay .
  section1.scrollIntoView({ behavior: 'smooth' });
});
//navWith navigation to sections .
//console.log(navLinkAnchor);
//console.log(section);
/*
navLinkAnchor.forEach((ele, i) => {
  ele.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(ele);

    const id = ele.getAttribute('href');
    console.log(id);

    document.querySelector(id);
    section[i].scrollIntoView({ behavior: 'smooth' });
    console.log(section[i]);
  });
});
*/
// console.log(section);
//delgation
navLinksUl.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///Tabbed component .
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  const currentTab = e.target.closest('.operations__tab');
  console.log(currentTab);

  if (!currentTab) return;

  const currContent = document.querySelector(
    `.operations__content--${currentTab.dataset.tab}`
  );
  //active tab ---> operations__tab--active
  //active --> operations__content--active

  //remove element first
  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(c => {
    c.classList.remove('operations__content--active');
  });
  //update the classes with current clicked button
  currentTab.classList.add('operations__tab--active');
  currContent.classList.add('operations__content--active');
});

// animaion fade ;
//main function to reduce reptitve .
const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //get the parent to all the children (get all the links again )
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(l => {
      if (l !== link) l.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
///nav is the current target .
//passing argumnets into handller function .
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///implement nav sticy scroll.
/*
const intialCoords = section1.getBoundingClientRect();
console.log(intialCoords);
window.addEventListener('scroll', function () {
  // console.log(window.scrollY);
  if (this.window.scrollY > intialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/
///////intersection observer.
//ex.1
/*
const callBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const option = {
  root: null,
  threshold: 0.1,
};
const observer = new IntersectionObserver(callBack, option);
observer.observe(section1);
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(stickyNav, obsOption);
observer.observe(header);

//revealing section heading
//section--hidden
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const secObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
section.forEach(sec => {
  secObserver.observe(sec);
  sec.classList.add('section--hidden');
});

//199.lazyLoading images .
const targetImg = document.querySelectorAll('img[data-src]');
// console.log(targetImg);
const imgLoading = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(imgLoading, {
  root: null,
  // threshold: 0,
  rootMargin: '200px',
});
targetImg.forEach(img => imgObserver.observe(img));

//200.build compunent no1 ;
/*
const slides = document.querySelectorAll('.slide');
const maxSlide = slides.length;

const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
console.log(btnLeft, btnRight);

// for view during  coding.
slider.style.transform = 'scale(.3) translateX(-1000px)';
slider.style.overflow = 'visible';
slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
let curSlide = 0;

btnRight.addEventListener('click', function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else curSlide++;
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
});
*/
//declare Seclector,btn and variables.

const slider = function () {
  //select Elements .

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const slideNum = slides.length;
  let curSlide = 0;

  ///fucntions
  //1. Create dots for slides .
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = 'dots__dot' data-slide = '${i}'>
    </button>`
      );
    });
  };
  //2.add activity to the current dot.
  const activeSlide = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelectorAll(`.dots__dot[data-slide="${slide}"]`)
      .forEach(dot => dot.classList.add('dots__dot--active'));
  };
  //3.main function (trasnlate between slides) .
  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%`)
    );
  };
  //4.nextSlide ➡
  const nextSlide = function () {
    if (curSlide === slideNum - 1) curSlide = 0;
    else curSlide++;
    gotoSlide(curSlide);
    activeSlide(curSlide);
  };
  //5.prevSlide ⬅
  const prevSlide = function () {
    if (curSlide === 0) curSlide = slideNum - 1;
    else curSlide--;
    gotoSlide(curSlide);
    activeSlide(curSlide);
  };
  //initial reloading
  const init = function () {
    createDots();
    activeSlide(0);
    gotoSlide(0);
  };
  init();
  //Event handler .
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    //use shortCircut .
    e.key === 'ArrowLeft' && prevSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) gotoSlide(slide);
    const { slide } = e.target.dataset;
    activeSlide(slide);
  });
};
slider();

/*
// document.addEventListener('DOMContentLoaded', e => {
//   console.log(navLinks);
// });
document.querySelector('a').href = 'https://translate.google.com/';
document.querySelector('img').src =
  'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D';
*/
///186. select , creat , and delete elements .
/*
///1.Selecting elements .

/// get full document and the type of html all data .
console.log(document);
//get html file head and body ()
console.log(document.documentElement);

console.log(document.head);
console.log(document.body);
console.log(document.querySelector('body'));
/// to make sure to get element start to get element loaded first and then get it

// document.addEventListener('DOMContentLoaded', function () {
//   console.log(document.documentElement);
// });

const allSections = document.querySelectorAll('section');
console.log(allSections);
allSections.forEach(ele => console.log(ele));

const allBtn = document.getElementsByTagName('button');
console.log(allBtn);

console.log(document.getElementsByClassName('btn'));

*/
///////////////////////////////////////////
/*
///186. creating  and inserting elements .
//insertAdjacentHTML.
/*
const sec = document.getElementsByClassName('section__header');

console.log(sec);
for (const ele of sec) {
  ele.innerHTML = ' ';
  const html = `
  The best day to learn java Script is today with jonas and udmemy 9-111
  today!
  `;

  ele.insertAdjacentHTML('afterbegin', html);
}
*/
//
/*
//creatElemetn ;
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functinality and analytics,
<button class="btn btn--close-cookie">Got it!</button>`;
header.append(message);
// header.prepend(message.cloneNode(true));
// header.after(message);
// header.before(message);

///3.remove element
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  //old way .
  // message.parentElement.removeChild(message);
  //updated
  message.remove();
});

//187 .
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// message.style.height = '6rem';
console.log(message.style.backgroundColor);
console.log(message.style.width);

message.style.minHeight =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

message.style.bottomMargin = '25px';
// console.log(getComputedStyle(message).getPropertyValue('margin'));

document.documentElement.style.setProperty('--color-primary', 'orangered');

console.log(getComputedStyle(message).getPropertyValue('background-color'));

///Attributes ,

const logo = document.querySelector('.nav__logo');
/// get the absolute url
console.log(logo.src);
/// get the relative url
console.log(logo.getAttribute(`src`));

console.log(logo.alt);
//change the value of standard attributes .
logo.alt = 'minimalist bank logo';
console.log(logo.alt);
/// declare non standard attribute
logo.setAttribute('designer', 'jonas');
console.log(logo.getAttribute('designer'));
///
const navFeature = document.querySelector('.nav__link');
//get absolute url
console.log(navFeature.href);
//get relative with getAttribute(href) ;
console.log(navFeature.getAttribute('href'));

///get dataSet in html index
console.log(logo.dataset.versionNumber);
// to seet
logo.dataset.size = '11';

// working with classes .
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');
console.log(logo.classList);

console.log(logo.className);
*/

//189.
/*
const h1 = document.querySelector('h1');
const alertHi = function () {
  alert('hi you hover over the heading ');
};
h1.addEventListener('mouseenter', alertHi);
setTimeout(() => h1.removeEventListener('mouseenter', alertHi), 3000);
*/
//old way using on-envents propery directly on the element .
// h1.onmouseenter = function (e) {
//   alert('you clicked the mouse ');
// };

///
//190 .propagation (caputre / bibling)
// console.log(Math.round(0.4));
/*
const random = (min, max) => Math.round(Math.random() * (max - min) + min);
const randomColor = () =>
  `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
//nav ---> nav
// nav = document.querySelector('.nav');
//ul---> navLinks
const navLinks = document.querySelector('.nav__links');
//a --->navLink
const navLink = document.querySelector('.nav__link');

navLink.addEventListener('click', function (e) {
  // e.stopPropagation();
  // console.log('child1', e.target);
  this.style.backgroundColor = randomColor();
});
navLinks.addEventListener('click', function (e) {
  console.log('child2', e.target);
  this.style.backgroundColor = randomColor();
  // e.stopPropagation();
});
document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('parent', e.target);
  this.style.backgroundColor = randomColor();
});
*/

/*
//193.dom traversing .
///traversing dom (pervious siblings /parent / childern / next siblings  )

const h1 = document.querySelector('h1');
console.log(h1);

//get the deppeast children of h1
console.log(h1.querySelectorAll('.highlight'));
//get the direct children.
console.log(h1.childNodes);
console.log(h1.innerHTML);
console.log(h1.children);
console.log(h1.firstChild);
console.log(h1.firstElementChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';
console.log(`-----------------`);
///going upwards : parents  .
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = `var(--gradient-secondary)`;
///siblings
console.log(h1.closest('.header'));
//html collection
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(ele => {
  if (ele !== h1) ele.style.transform = 'scale(0.5)';
});
h1.closest('.header').nextElementSibling.style.backgroundColor = '#c3c3c3';

*/
//201,life cycle of the dom events.
/*
//1.DomContentLoaded .

document.addEventListener('DOMContentLoaded', e =>
  console.log('html is loaded', e)
);

//2.load .
window.addEventListener('load', e => console.log('page has been loaded', e));

//3.beforeloaded
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/
console.log(
  'height , width ',
  document.documentElement.clientHeight,
  document.documentElement.clientWidth
);
