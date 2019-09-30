import { from } from '../utils';
import { addClass, removeClass } from '../utils/dom';

enum Classes {
  touched = 'touched',
  untouched = 'untouched',
}

export function init(form: HTMLFormElement) {
  const inputs = from(form.querySelectorAll('input'));

  for (const input of inputs) {
    addClass(input, Classes.untouched);

    const onBlur = () => {
      removeClass(input, Classes.untouched);
      addClass(input, Classes.touched);
      input.removeEventListener('blur', onBlur);
    };

    input.addEventListener('blur', onBlur);
  }
}
