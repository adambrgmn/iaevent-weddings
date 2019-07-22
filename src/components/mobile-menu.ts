/**
 * Selectors for elements related to the mobile menu
 */
const TOGGLE = 'toggle-menu';
const TOGGLE_ACTIVE = 'toggle-active';

const MENU = 'menu';
const MENU_VISIBLE = 'menu-visible';

/**
 * Initialize the mobile menu handlers enabling toggling the mobile menu
 */
function init() {
  const menu = document.querySelector('.' + MENU);
  const toggleButton = document.querySelector('.' + TOGGLE);

  if (menu && toggleButton) {
    /**
     * Make sure that active and visible classes are removed initially, this is
     * just to guard against any mistakes of adding the classes in the html
     */
    menu.classList.remove(MENU_VISIBLE);
    toggleButton.classList.remove(TOGGLE_ACTIVE);

    /**
     * Toggle the active and visible classes on the menu button and on the nav
     * menu itself.
     */
    const toggleClasses = () => {
      menu.classList.toggle(MENU_VISIBLE);
      toggleButton.classList.toggle(TOGGLE_ACTIVE);
    };

    toggleButton.addEventListener('click', toggleClasses);

    /**
     * When the menu trasition is done we will apply focus on the first nav link
     *
     * @param {Event} evt
     */
    const focusNavLink = (evt: Event) => {
      if (evt.target === menu && menu.classList.contains(MENU_VISIBLE)) {
        const el = menu.querySelector('a');
        if (el) el.focus();
      }
    };

    menu.addEventListener('transitionend', focusNavLink);
  }
}

export { init };
