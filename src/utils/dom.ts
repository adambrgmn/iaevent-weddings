export const toggleClass = <T extends HTMLElement>(
  el: T,
  className: string,
): T => {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0) classes.splice(existingIndex, 1);
    else classes.push(className);

    el.className = classes.join(' ');
  }

  return el;
};

export const removeClass = <T extends HTMLElement>(
  el: T,
  ...classNames: string[]
): T => {
  if (el.classList) {
    el.classList.remove(...classNames);
  } else {
    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];
      el.className = el.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi',
        ),
        ' ',
      );
    }
  }

  return el;
};

export const addClass = <T extends HTMLElement>(
  el: T,
  ...classNames: string[]
): T => {
  if (el.classList) el.classList.add(...classNames);
  else el.className += ' ' + classNames.join(' ');

  return el;
};

export const hasClass = <T extends HTMLElement>(
  el: T,
  className: string,
): T => {
  if (el.classList) el.classList.contains(className);
  else new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

  return el;
};
