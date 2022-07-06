const primaryNav = document.querySelector('.navul');
const navToggle = document.querySelector('.mobile-nav-toggle');
const navigationHeight = document.querySelector('.primary-nav').offsetHeight;

document.documentElement.style.setProperty('--scroll-padding', navigationHeight - 1 + "px");

navToggle.addEventListener('click', () => {
	const visibility = primaryNav.getAttribute("data-visible");
	if (visibility === "false") {
		primaryNav.setAttribute("data-visible", "true");
		navToggle.setAttribute("aria-expanded", "true");
	} else {
		primaryNav.setAttribute("data-visible", "false");
		navToggle.setAttribute("aria-expanded", "false");
	}

});
