import { bindThisToMemberFunctions } from "./utils/bind-this-to-member";
import { makeUniqueId } from './utils/unique-id';
import { merge } from 'lodash-es';

type Error = {
  element: HTMLInputElement | HTMLSelectElement;
  message: string;
};

type Options = {
  validationMessages: {
    valueMissing: {
      checkbox: string,
      radio: string,
      select: string,
      'select-multiple': string,
      default: string
    },
    typeMismatch: {
      email: string,
      url: string,
      default: string,
    },
    patternMismatch: {
      email: string,
      url: string,
      number: string,
      color: string,
      date: string,
      time: string,
      month: string,
      default: string,
    },
    rangeOverflow: {
      range: string,
      number: string,
      date: string,
      time: string,
      default: string,
    },
    rangeUnderflow: {
      range: string,
      number: string,
      date: string,
      time: string,
      default: string,
    }
  }
}

class ValidMate {
  inputsToValidate: NodeListOf<HTMLInputElement | HTMLSelectElement>;

  errors: Array<Error> = [];

  form: HTMLFormElement;

  options: Options = {
    validationMessages: {
      valueMissing: {
        checkbox: 'Please add a value for this checkbox',
        radio: 'Please add a value for this radio',
        select: 'Please ensure a value is selected',
        'select-multiple': 'Please ensure a value is selected',
        default: 'Please select a value',
      },
      typeMismatch: {
        email: 'Please enter a valid email address',
        url: 'Please enter a URL',
        default: 'Please enter a valid value',
      },
      patternMismatch: {
        email: 'Please enter a valid email address',
        url: 'Please enter a URL',
        number: 'Please enter a number',
        color: 'Please match the following format: #rrggbb',
        date: 'Please use the YYYY-MM-DD format',
        time: 'Please use the 24-hour time format. Ex. 23:00',
        month: 'Please use the YYYY-MM format',
        default: 'Please match the requested format'
      },
      rangeOverflow: {
        range: 'The value must be less than or equal to the value',
        number: 'The value must be less than or equal to the value',
        date: 'The value must be less than or equal to the value',
        time: 'The value must be less than or equal to the value',
        default: 'The value must be less than or equal to the value'
      },
      rangeUnderflow: {
        range: 'The value must be greater than or equal to the value',
        number: 'The value must be greater than or equal to the value',
        date: 'The value must be greater than or equal to the value',
        time: 'The value must be greater than or equal to the value',
        default: 'The value must be greater than or equal to the value'
      }
    },
  }

  constructor(form: HTMLFormElement, options?: Options) {
    this.form = form;
    this.inputsToValidate = form.querySelectorAll('input, select, textarea');
    this.options = merge(this.options, options);

    bindThisToMemberFunctions(this);

    form.setAttribute('novalidate', 'true');

    form.addEventListener('submit', this.onFormSubmit);
  }

  private getErrorForInput(input: HTMLInputElement | HTMLSelectElement) {
    const ID = input.getAttribute('id');

    const error = this.form.querySelector(`#error-${ID}`);
    if (!error) return;

    return error;
  }
  
  private resetErrors() {
    this.errors.forEach((error) => {
      const errorElement = this.getErrorForInput(error.element);
      const field = error.element;

      if (field) field.removeAttribute('aria-describedby');

      if (errorElement) errorElement.remove();
    });

    this.errors = [];
  }

  private showError(error: Error): HTMLElement {
    const errorElement = this.createErrorElement(error);
    error.element.after(errorElement);

    return errorElement;
  }

  private createErrorElement(error: Error): HTMLSpanElement {
    const input = error.element;
    const errorElement = document.createElement('span');
    const errorMessage = document.createTextNode(error.message);

    errorElement.classList.add('error');
    errorElement.appendChild(errorMessage);

    // If the element has no ID, make one so that we can tie it to the 
    // error.
    if (input.hasAttribute('id') === false) {
      input.setAttribute('id', makeUniqueId())
    }

    const inputID = input.getAttribute('id');
    input.setAttribute('aria-describedby', `error-${inputID}`);
    errorElement.setAttribute('id', `error-${inputID}`);

    return errorElement;
  }

  getValidationMessageForInput(input: HTMLInputElement | HTMLSelectElement): string {
    const inputType = input.type;

    if (input.validity.valueMissing) {
      return this.options.validationMessages.valueMissing?.[inputType] || this.options.validationMessages.valueMissing.default;
    }

    if (input.validity.typeMismatch) {
      return this.options.validationMessages.typeMismatch?.[inputType] || this.options.validationMessages.typeMismatch.default; 
    }

    if (input.validity.patternMismatch) {
      return this.options.validationMessages.patternMismatch?.[inputType] || this.options.validationMessages.patternMismatch.default;  
    }

    if (input.validity.rangeOverflow) {
      return this.options.validationMessages.rangeOverflow?.[inputType] || this.options.validationMessages.rangeOverflow.default;  
    }

    if (input.validity.rangeUnderflow) {
      return this.options.validationMessages.rangeUnderflow?.[inputType] || this.options.validationMessages.rangeUnderflow.default;  
    }

    return 'There was an error.';
  }

  validateInput(input: HTMLInputElement | HTMLSelectElement): boolean {
    const valid = input.checkValidity();

    if (valid) return true;

    const error: Error = {
      element: input,
      message: this.getValidationMessageForInput(input),
    };

    this.errors.push(error);

    this.showError(error);

    return false;
  }

  validateForm() {
    this.resetErrors();

    this.inputsToValidate.forEach((input) => {
      this.validateInput(input);
    });
  }

  onFormSubmit(e: Event) {
    e.preventDefault();

    this.validateForm()
  }
}

export { ValidMate };
