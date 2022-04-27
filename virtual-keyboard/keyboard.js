import keycodes from './keycodes.js';

export default class Keyboard {
  constructor() {
    this.specialKeys = ['ShiftRight', 'ShiftLeft', 'ControlLeft', 'AltLeft', 'MetaLeft', 'MetaRight', 'AltRight'];
    if (!localStorage.getItem('locale')) {
      localStorage.setItem('locale', 'en');
      this.locale = 'en';
    } else {
      this.locale = localStorage.getItem('locale');
    }
    this.isCapslock = false;
    this.layout = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Enter'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash'],
      ['ShiftLeft', 'IntlBackslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
      ['ControlLeft', 'AltLeft', 'MetaLeft', 'Space', 'MetaRight', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ];
    this.textArea = document.createElement('textarea');
    document.body.append(this.textArea);
    this.keyboard = document.createElement('div');
    this.keyboard.className = 'keyboard';
    document.body.append(this.keyboard);
    this.keyboard.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    document.addEventListener('keydown', (event) => {
      const keyCode = event.code;
      const keyElement = document.querySelector(`[data-code='${keyCode}']`);
      keyElement.classList.add('key-pressed');
    });
    document.addEventListener('keyup', (event) => {
      const keyCode = event.code;
      const keyElement = document.querySelector(`[data-code='${keyCode}']`);
      keyElement.classList.remove('key-pressed');
    });
    document.body.append('Keyboard created for MacOS. To switch keyboard languages press CTRL+SHIFT');
    this.localeElement = document.createElement('p');
    this.localeElement.textContent = `Current keyboard language is ${this.locale === 'en' ? 'English' : 'Русский'}`;
    document.body.append(this.localeElement);
    document.addEventListener('keydown', (event) => {
      if ((event.code === 'ShiftLeft' && event.ctrlKey) || (event.code === 'ControlLeft' && event.shiftKey)) {
        const newLanguage = this.locale === 'en' ? 'ru' : 'en';
        localStorage.setItem('locale', newLanguage);
        this.locale = newLanguage;
        this.localeElement.textContent = `Current keyboard language is ${this.locale === 'en' ? 'English' : 'Русский'}`;
        document.querySelector("[data-code='ShiftLeft']").style.backgroundColor = 'green';
        document.querySelector("[data-code='ControlLeft']").style.backgroundColor = 'green';
        setTimeout(() => {
          this.render();
        }, 300);
      }
    });
  }

  handleMouseEvent(event) {
    const keyCode = event.target.getAttribute('data-code') || event.target.parentNode.getAttribute('data-code');
    if (!keyCode) {
      return;
    }
    if (keyCode.startsWith('Key') || keyCode.startsWith('Arrow')) {
      let value = keycodes[keyCode][this.locale].primary;
      const isUpperCase = event.getModifierState('CapsLock') || event.getModifierState('Shift') || this.isCapslock || this.isShift;
      if (isUpperCase) {
        value = value.toUpperCase();
      }
      this.textArea.value += value;
      return;
    }
    if (keyCode === 'Enter') {
      this.textArea.value += '\n';
      return;
    }
    if (keyCode === 'Tab') {
      this.textArea.value += '\t';
      return;
    }
    if (keyCode === 'Backspace') {
      this.textArea.value = this.textArea.value.slice(0, this.textArea.value.length - 1);
      return;
    }
    if (keyCode === 'Space') {
      this.textArea.value += ' ';
      return;
    }
    if (keyCode === 'CapsLock') {
      const capsElement = document.querySelector("[data-code='CapsLock']");
      if (!this.isCapslock) {
        this.isCapslock = true;
        capsElement.classList.add('key-pressed');
      } else {
        this.isCapslock = false;
        capsElement.classList.remove('key-pressed');
      }
      return;
    }
    if (this.specialKeys.includes(keyCode)) {
      return;
    }
    let value = keycodes[keyCode][this.locale];
    if (event.getModifierState('Shift')) {
      value = value.secondary;
    } else {
      value = value.primary;
    }
    this.textArea.value += value;
  }

  render() {
    this.keyboard.innerHTML = '';
    this.layout.forEach((keyLine) => {
      const keyLineTemplate = document.createElement('div');
      keyLineTemplate.className = 'key-line';
      keyLine.forEach((keyCode) => {
        keyLineTemplate.append(this.getKeyHTML(keyCode));
      });
      this.keyboard.append(keyLineTemplate);
    });
  }

  getKeyHTML(keyCode) {
    const keyData = keycodes[keyCode];
    const { primary, secondary } = keyData[this.locale];
    const size = keyData.size ? keyData.size : 'sm';
    const keyTemplate = document.createElement('div');
    keyTemplate.classList.add('key');
    keyTemplate.classList.add(`key-${size}`);
    keyTemplate.setAttribute('data-code', keyCode);
    const primarySpan = document.createElement('span');
    primarySpan.innerHTML = primary;
    if (secondary) {
      primarySpan.classList.add('key-char-primary');
      const secondarySpan = document.createElement('span');
      secondarySpan.classList.add('key-char-secondary');
      secondarySpan.innerHTML = secondary;
      keyTemplate.append(secondarySpan);
    } else {
      primarySpan.classList.add('key-char-only');
    }
    keyTemplate.append(primarySpan);
    return keyTemplate;
  }
}
