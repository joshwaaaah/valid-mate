# ValidMate

A lightweight form validation library for the browser.

## Features

- Simple API for form validation
- Built-in validation for standard HTML5 form validation attributes
- Custom validation messages
- Custom validators
- Accessibility features
- Written in TypeScript
- Pretty good test coverage

## Usage

```ts
import { ValidMate } from 'valid-mate';

const form = document.querySelector('form');
const validation = new ValidMate(form);
```

## API

### `validateForm()`
Validates all inputs in the form. Shows error messages for any invalid inputs.

### `validateInput(input: HTMLInputElement | HTMLSelectElement): { valid: boolean, message: string }`
Validates a single input element. Shows an error message if invalid.
Returns `true` if valid, `false` if invalid.

### `addCustomValidator(validator: CustomValidator)`
Adds a custom validator that can be used to validate inputs.
The validator object should have:
- `name`: String identifier for the validator; this must match a data attribute on the input element(s) you want to validate
- `validate`: Function that takes an input element and returns boolean
- `message`: Error message to show if validation fails
