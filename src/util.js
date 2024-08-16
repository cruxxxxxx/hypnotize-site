export function scrollToElementWithPadding(element, paddingTop) {
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const offsetPosition = absoluteElementTop - paddingTop;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

export function scrollToTop() {
  document.documentElement.scrollTop = 0;
}