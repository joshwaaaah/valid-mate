import { HTMLFormElement, Window } from 'happy-dom';
import { expect, test, describe } from 'vitest';
import { ValidMate } from '../valid-mate';

describe('ValidMate', () => {
  test('an ivalid `input` should return `false`', () => {
    const window = new Window();
    const document = window.document;

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
    const window = new Window();
    const document = window.document;

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
    const window = new Window();
    const document = window.document;

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
    const window = new Window();
    const document = window.document;

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
    const window = new Window();
    const document = window.document;

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
    const window = new Window();
    const document = window.document;

    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" value="Lemonade">
    </div>`;

    const form = document.querySelector('form');
    new ValidMate(form);

    expect(form.getAttribute('novalidate')).toBeTruthy();
  });

  test('a custom error message should display if set when a required value is missing', () => {
    const window = new Window();
    const document = window.document;

    document.body.innerHTML = `<form>
      <label for="name">Name</label>
      <input name="name" id="name" required value="">
    </div>`;

    const form = document.querySelector('form');
    new ValidMate(form, {
      validationMessages: {
        missingValue: {
          checkbox: 'This field is required.',
          radio: 'Please select a value.',
          select: 'Please select a value.',
          'select-multiple': 'Please select at least one value.',
          default: 'Please fill out this field.'
        },
      }
    });
  })
});
