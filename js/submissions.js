import {
  getContactSubmissions,
  deleteContactSubmission,
  clearAllContactSubmissions,
  createToast,
} from './validation.js';

const submissionsList = document.getElementById('submissionsList');
const searchName = document.getElementById('searchName');
const searchEmail = document.getElementById('searchEmail');
const deleteAllButton = document.getElementById('deleteAll');
const submissionCount = document.getElementById('submissionCount');
const loader = document.getElementById('pageLoader');

const formatDate = (isoString) => {
  if (!isoString) return 'Unknown date';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFilteredSubmissions = () => {
  const allSubmissions = getContactSubmissions();
  const nameQuery = searchName ? searchName.value.trim().toLowerCase() : '';
  const emailQuery = searchEmail ? searchEmail.value.trim().toLowerCase() : '';

  return allSubmissions
    .slice()
    .reverse()
    .filter((submission) => {
      const matchesName = submission.name.toLowerCase().includes(nameQuery);
      const matchesEmail = submission.email.toLowerCase().includes(emailQuery);
      return matchesName && matchesEmail;
    });
};

const updateSubmissionCount = (count, total) => {
  if (!submissionCount) return;
  submissionCount.textContent = `${count} of ${total} submission${total === 1 ? '' : 's'}`;
};

const renderEmptyState = (message) => {
  if (!submissionsList) return;
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = `
    <i class="fas fa-inbox"></i>
    <div>
      <strong>${message}</strong>
      <p>Once you submit a message, it will appear here instantly.</p>
    </div>
  `;
  submissionsList.innerHTML = '';
  submissionsList.appendChild(emptyState);
};

const renderSubmissions = () => {
  if (!submissionsList) return;

  const items = getFilteredSubmissions();
  const totalItems = getContactSubmissions().length;
  updateSubmissionCount(items.length, totalItems);

  if (!items.length) {
    const baseMessage = totalItems === 0 ? 'No submissions yet.' : 'No matching submissions found.';
    renderEmptyState(baseMessage);
    return;
  }

  submissionsList.innerHTML = '';
  items.forEach((submission) => {
    const card = document.createElement('article');
    card.className = 'submission-card';
    card.innerHTML = `
      <div class="card-header">
        <div>
          <h3>${submission.name}</h3>
          <p class="meta">${submission.email}</p>
        </div>
        <button type="button" class="delete-item" data-id="${submission.id}">Delete</button>
      </div>
      <div class="message-label"><i class="fas fa-envelope-open-text"></i> Message</div>
      <p>${submission.message}</p>
      <div class="card-footer">
        <span class="meta">Submitted ${formatDate(submission.submittedAt)}</span>
      </div>
    `;
    submissionsList.appendChild(card);
  });
};

const showLoader = () => {
  if (!loader) return;
  loader.setAttribute('aria-hidden', 'false');
  loader.style.display = 'flex';
};

const hideLoader = () => {
  if (!loader) return;
  loader.setAttribute('aria-hidden', 'true');
  loader.style.display = 'none';
};

if (submissionsList) {
  showLoader();
  setTimeout(() => {
    hideLoader();
    renderSubmissions();
  }, 550);
}

if (searchName) {
  searchName.addEventListener('input', renderSubmissions);
}

if (searchEmail) {
  searchEmail.addEventListener('input', renderSubmissions);
}

if (deleteAllButton) {
  deleteAllButton.addEventListener('click', () => {
    const submissions = getContactSubmissions();
    if (!submissions.length) {
      createToast('There are no messages to remove.', 'error');
      return;
    }

    const confirmation = window.confirm('Delete all submissions? This cannot be undone.');
    if (!confirmation) return;

    clearAllContactSubmissions();
    renderSubmissions();
    createToast('All submissions deleted.', 'success');
  });
}

if (submissionsList) {
  submissionsList.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-item');
    if (!button) return;

    const submissionId = button.dataset.id;
    if (!submissionId) return;

    const confirmed = window.confirm('Remove this submission permanently?');
    if (!confirmed) return;

    deleteContactSubmission(submissionId);
    renderSubmissions();
    createToast('Submission removed.', 'success');
  });
}
