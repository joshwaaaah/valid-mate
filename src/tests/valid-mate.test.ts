import { HTMLFormElement, Window } from 'happy-dom';
import { expect, test, describe, beforeEach } from 'vitest';
import { ValidMate } from '../valid-mate';

let window = new Window();
let document = window.document;

describe('ValidMate', () => {

  beforeEach(() => {
    window = new Window();
    document = window.document;
    document.body.innerHTML = '';
  })

  test('an ivalid `input` should return `false`', () => {
    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input required name="name" id="name" value="">
    </div>`;

    const form = document.querySelector('form');
    const validation = new ValidMate(form);
    const requiredInput = form.querySelector('input');

    expect(validation.validateInput(requiredInput)).toBeFalsy();
  });

  test('a valid `input` should return `true`', () => {
    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" value="Lemonade">
    </div>`;

    const form = document.querySelector('form');
    const validation = new ValidMate(form);
    const input = form.querySelector('input');

    expect(validation.validateInput(input)).toBeTruthy();
  });

  test('an invalid `input` should have an associated aria-describedby attribute', () => {
    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" required value="">
    </div>`;

    const form = document.querySelector('form');
    const validation = new ValidMate(form);
    const input = form.querySelector('input');
    validation.validateForm();

    expect(input.getAttribute('aria-describedby')).toBe('error-name')
  });

  test('an invalid `input` should have an associated HTML element on the page', () => {
    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" required value="">
    </div>`;

    const form = document.querySelector('form');
    const validation = new ValidMate(form);
    validation.validateForm();

    const associatedErrorElement = document.querySelector('#error-name');

    expect(associatedErrorElement).toBeTruthy();
  });

  test('an invalid `input` should have an associated HTML element on the page if it has no ID', () => {
    document.body.innerHTML = `<form>
      <label>Name</label>
      <input name="name" required value="">
    </div>`;

    const form = document.querySelector('form');
    const validation = new ValidMate(form);
    validation.validateForm();

    const input = form.querySelector('input');
    const inputId = input.getAttribute('id');

    const associatedErrorElement = document.querySelector(`#error-${inputId}`);

    expect(associatedErrorElement).toBeTruthy();
  });

  test('a form to be validated should have the `novalidate` attribute', () => {
    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" value="Lemonade">
    </div>`;

    const form = document.querySelector('form');
    new ValidMate(form);

    expect(form.getAttribute('novalidate')).toBeTruthy();
  });

  describe('custom error messages', () => {
    test('valueMissing: a custom error message should display if a required value is missing on a text input', () => {
      document.body.innerHTML = `<form>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" required>
      </div>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          valueMissing: {
            default: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('valueMissing: a custom error message should display if a required value is missing on a checkbox', () => {
      document.body.innerHTML = `<form>
        <label for="terms">Name</label>
        <input type="checkbox" name="terms" id="terms" required>
      </div>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          valueMissing: {
            checkbox: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('valueMissing: a custom error message should display if a required value is missing on a radio', () => {
      document.body.innerHTML = `<form>
        <label for="terms">Name</label>
        <input type="radio" name="terms" id="terms" required>
      </div>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          valueMissing: {
            radio: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('valueMissing: a custom error message should display if a required value is missing on a select', () => {
      document.body.innerHTML = `<form>
        <label for="job">What's your job?</label>
        <select name="job" id="job" required>
          <option value="" selected>Select a job</option>
          <option value="Developer">Developer</option>
          <option value="Builder">Builder</option>
          <option value="Baker">Baker</option>
          <option value="Nurse">Nurse</option>
          <option value="Politician">Politician</option>
        </select>
      </form>`;
      
      const select = document.querySelector('select') as unknown as HTMLSelectElement;
      // `happy-dom` doesn't support setting the value of a select element to an empty string.
      select.value = '';
      const CUSTOM_ERROR_MESSAGE = 'Please select a country';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          valueMissing: {
            'select-one': CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE);
    });

    test('valueMissing: a custom error message should display if a required value is missing on a multiple', () => {
      document.body.innerHTML = `<form>
        <label for="job">What's your job?</label>
        <select name="job" id="job" required multiple>
          <option value="" selected>Select a job</option>
          <option value="Developer">Developer</option>
          <option value="Builder">Builder</option>
          <option value="Baker">Baker</option>
          <option value="Nurse">Nurse</option>
          <option value="Politician">Politician</option>
        </select>
      </form>`;
      
      const select = document.querySelector('select') as unknown as HTMLSelectElement;
      // `happy-dom` doesn't support setting the value of a select element to an empty string.
      select.value = '';
      const CUSTOM_ERROR_MESSAGE = 'Please select a country';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          valueMissing: {
            'select-multiple': CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE);
    });

    test('typeMismatch: a custom error message should display if an invalid email is entered', () => {
      document.body.innerHTML = `<form>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" value="not-an-email">
      </div>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          typeMismatch: {
            email: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('typeMismatch: a custom error message should display if an invalid url is entered', () => {
      document.body.innerHTML = `<form>
        <label for="websote">Website</label>
        <input type="url" name="url" id="url" value="not-a-url">
      </div>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          typeMismatch: {
            url: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('patternMismatch: a custom error message should display if an invalid email pattern is entered', () => {
      document.body.innerHTML = `
      <form>
        <input type="email" pattern="\d{4,4}" value="info@test.com">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          patternMismatch: {
            email: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('patternMismatch: a custom error message should display if an invalid url pattern is entered', () => {
      document.body.innerHTML = `
      <form>
        <input type="url" pattern="\d{4,4}" value="https://www.google.com">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          patternMismatch: {
            url: CUSTOM_ERROR_MESSAGE
          },
        }
      });
  
      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('patternMismatch: a custom error message should display if an invalid tel pattern is entered', () => {
      document.body.innerHTML = `
      <form>
        <input type="tel" pattern="\\d{4,4}" value="1">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          patternMismatch: {
            tel: CUSTOM_ERROR_MESSAGE
          },
        }
      });

      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('patternMismatch: a custom error message should display if an invalid search pattern is entered', () => {
      document.body.innerHTML = `
      <form>
        <input type="search" pattern="\\d{4,4}" value="1">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          patternMismatch: {
            search: CUSTOM_ERROR_MESSAGE
          },
        }
      });

      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('patternMismatch: a custom error message should display if an invalid password pattern is entered', () => {
      document.body.innerHTML = `
      <form>
        <input type="password" pattern="\\d{4,4}" value="1">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          patternMismatch: {
            password: CUSTOM_ERROR_MESSAGE
          },
        }
      });

      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });

    test('rangeUnderflow: a custom error message should display if number is less than min', () => {
      document.body.innerHTML = `
      <form>
        <input type="number" min="2" value="1">
      </form>`;
  
      const CUSTOM_ERROR_MESSAGE = 'A custom error message';
      const form = document.querySelector('form');
      const validation = new ValidMate(form, {
        validationMessages: {
          rangeUnderflow: {
            number: CUSTOM_ERROR_MESSAGE
          },
        }
      });

      validation.validateForm();
  
      expect(document.documentElement.innerText).toContain(CUSTOM_ERROR_MESSAGE)
    });
  });
});
