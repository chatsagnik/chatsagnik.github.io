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

const primaryHeader = document.querySelector('.primary-header');
const scrollWatcher = document.createElement('div');

scrollWatcher.setAttribute('data-scroll-watcher','');
primaryHeader.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries)=>{
  if (window.matchMedia("(min-width: 851px)")){
    primaryHeader.classList.toggle('sticking', !entries[0].isIntersecting)
  }
});

navObserver.observe(scrollWatcher);

function mytoggle(iden) {
  var x = document.getElementById(iden);
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}