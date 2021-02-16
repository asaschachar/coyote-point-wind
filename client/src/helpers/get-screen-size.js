export default function getScreenSize(windowSize) {
  let isDesktop = windowSize.width > 1000;
  let isMobile = windowSize.width < 564;
  let isTablet = windowSize.width >= 564 && windowSize.width <= 1000;

  return {
    isDesktop,
    isMobile,
    isTablet,
  }
}
