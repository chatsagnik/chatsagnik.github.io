// Stop scrolling before headers
const primaryNav = document.querySelector('.primary-navigation');
const navigationHeight = document.querySelector('.navitem').offsetHeight;
const hamMenu = document.querySelector('.hamburgerMenu');
// const body = document.querySelector('.body');
const navToggle = document.querySelector('.mobile-nav-toggle');

document.documentElement.style.setProperty('--scroll-padding', navigationHeight + "px");

navToggle.addEventListener('click', () => {
	const visibility = primaryNav.getAttribute("data-visible");
	if (visibility === "false") {
		primaryNav.setAttribute("data-visible", "true");
    navToggle.setAttribute("aria-expanded", "true");
    hamMenu.classList.add("change");
	}
  else{ 
  primaryNav.setAttribute("data-visible", "false");
    navToggle.setAttribute("aria-expanded", "false");
    hamMenu.classList.remove("change");
  }
  
});

// Intersection Observer to change menu text color in different sections
const navul = document.querySelector(".primary-navigation");
const sectionEven = document.querySelector(".section-even");

const sectionEvenOptions = {
  rootMargin: "-80px",
  threshold: 0.15
};

const sectionEvenObserver = new IntersectionObserver(function(
  entries,
  sectionEvenObserver
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      navul.classList.remove("nav-scrolled");
    } else {
      navul.classList.add("nav-scrolled");
      // console.log(entry.target);
    }
  });
},
sectionEvenOptions);

sectionEvenObserver.observe(sectionEven);