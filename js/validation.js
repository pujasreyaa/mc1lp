const STORAGE_KEY = 'contactSubmissions';

const normalizeInput = (value) => {
  return value.trim().replace(/\s+/g, ' ');
};

const validateEmail = (value) => {
  const email = normalizeInput(value);
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const validateContactValues = ({ name, email, message }) => {
  const errors = {};
  const trimmedName = normalizeInput(name);
  const trimmedEmail = normalizeInput(email);
  const trimmedMessage = normalizeInput(message);

  if (!trimmedName) {
    errors.name = 'Name cannot be empty.';
  }

  if (!trimmedEmail) {
    errors.email = 'Email cannot be empty.';
  } else if (!validateEmail(trimmedEmail)) {
    errors.email = 'Email must be a valid address.';
  }

  if (!trimmedMessage) {
    errors.message = 'Message cannot be empty.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must contain at least 10 characters.';
  }

  return { errors, values: { name: trimmedName, email: trimmedEmail, message: trimmedMessage } };
};

const getContactSubmissions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Could not parse contact submissions from storage.', error);
    return [];
  }
};

const saveContactSubmission = (submission) => {
  const items = getContactSubmissions();
  items.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const deleteContactSubmission = (id) => {
  const items = getContactSubmissions().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
};

const clearAllContactSubmissions = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const createToast = (message, type = 'success') => {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
};

export {
  normalizeInput,
  validateEmail,
  validateContactValues,
  getContactSubmissions,
  saveContactSubmission,
  deleteContactSubmission,
  clearAllContactSubmissions,
  createToast,
};
