import { ValidMate } from './valid-mate'

const form = document.querySelector('form');

if(form) {
  const validatedForm = new ValidMate(form);

  validatedForm.addCustomValidator({
    name: 'date-validator',
    validate: (input) => {
      return new Date(input.value) > new Date('2026-10-10');
    },
    message: 'Wowzer, something went wrong'
  })
}
