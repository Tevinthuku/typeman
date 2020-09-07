export function registerSW() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
}
