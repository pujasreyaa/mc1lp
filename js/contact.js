import {
  validateContactValues,
  saveContactSubmission,
  createToast,
} from './validation.js';

const contactForm = document.getElementById('contactForm');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

const setFieldState = (field, messageElement, message) => {
  if (!field || !messageElement) return;
  field.classList.remove('input-valid', 'input-invalid');

  if (!message) {
    field.classList.add('input-valid');
    messageElement.textContent = '';
    return;
  }

  field.classList.add('input-invalid');
  messageElement.textContent = message;
};

const clearFieldState = (field, messageElement) => {
  if (!field || !messageElement) return;
  field.classList.remove('input-invalid');
  messageElement.textContent = '';
};

const handleValidation = () => {
  const values = {
    name: nameField.value,
    email: emailField.value,
    message: messageField.value,
  };

  const { errors, values: sanitized } = validateContactValues(values);

  setFieldState(nameField, nameError, errors.name || '');
  setFieldState(emailField, emailError, errors.email || '');
  setFieldState(messageField, messageError, errors.message || '');

  return { isValid: Object.keys(errors).length === 0, sanitized };
};

const resetFormState = () => {
  [nameField, emailField, messageField].forEach((field) => {
    if (field) field.classList.remove('input-valid', 'input-invalid');
  });
  [nameError, emailError, messageError].forEach((messageElement) => {
    if (messageElement) messageElement.textContent = '';
  });
};

const createSubmission = ({ name, email, message }) => ({
  id: Date.now().toString(),
  name,
  email,
  message,
  submittedAt: new Date().toISOString(),
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const { isValid, sanitized } = handleValidation();
    if (!isValid) {
      createToast('Please fix the errors before submitting.', 'error');
      return;
    }

    const submission = createSubmission(sanitized);
    saveContactSubmission(submission);

    createToast('Message saved successfully.', 'success');
    contactForm.reset();
    resetFormState();
  });

  [nameField, emailField, messageField].forEach((field) => {
    if (!field) return;
    field.addEventListener('input', () => {
      const { errors } = validateContactValues({
        name: nameField.value,
        email: emailField.value,
        message: messageField.value,
      });

      if (field === nameField) {
        setFieldState(nameField, nameError, errors.name || '');
      }
      if (field === emailField) {
        setFieldState(emailField, emailError, errors.email || '');
      }
      if (field === messageField) {
        setFieldState(messageField, messageError, errors.message || '');
      }
    });
  });
}
