import { ValidMate } from './valid-mate'

const form = document.querySelector('form');

if(form) {
  const validatedForm = new ValidMate(form);
}
