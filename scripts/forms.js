const MIN_SUBMIT_DELAY_SECONDS = 3;

function createReferenceId() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DR-${yyyy}${mm}${dd}-${token}`;
}

function setFieldError(field, message) {
  const target = document.querySelector(`[data-error-for="${field.name}"]`);
  if (target instanceof HTMLElement) {
    target.textContent = message;
  }

  if (message) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function initDeleteMyDataForm() {
  const form = document.querySelector('[data-delete-form]');
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const fields = {
    full_name: form.elements.namedItem('full_name'),
    email: form.elements.namedItem('email'),
    phone: form.elements.namedItem('phone'),
    request_details: form.elements.namedItem('request_details'),
    confirmation: form.elements.namedItem('confirmation'),
  };

  const honeypot = form.elements.namedItem('company');
  const submittedAt = form.elements.namedItem('submitted_at');
  const referenceInput = form.elements.namedItem('reference_id');

  const summary = form.querySelector('[data-form-errors]');
  const summaryList = form.querySelector('[data-form-errors-list]');
  const status = form.querySelector('[data-form-status]');
  const success = form.querySelector('[data-form-success]');
  const successRef = form.querySelector('[data-reference-output]');
  const submitButton = form.querySelector('button[type="submit"]');
  const counter = form.querySelector('[data-char-counter]');

  if (!(fields.full_name instanceof HTMLInputElement)) return;
  if (!(fields.email instanceof HTMLInputElement)) return;
  if (!(fields.phone instanceof HTMLInputElement)) return;
  if (!(fields.request_details instanceof HTMLTextAreaElement)) return;
  if (!(fields.confirmation instanceof HTMLInputElement)) return;
  if (!(honeypot instanceof HTMLInputElement)) return;
  if (!(submittedAt instanceof HTMLInputElement)) return;
  if (!(referenceInput instanceof HTMLInputElement)) return;
  if (!(submitButton instanceof HTMLButtonElement)) return;

  const stampStarted = () => {
    submittedAt.value = String(Math.floor(Date.now() / 1000));
  };

  const issueReference = () => {
    referenceInput.value = createReferenceId();
  };

  const setStatus = (text, state = '') => {
    if (!(status instanceof HTMLElement)) {
      return;
    }

    status.textContent = text;
    if (state) {
      status.setAttribute('data-state', state);
    } else {
      status.removeAttribute('data-state');
    }
  };

  const hideSummary = () => {
    if (summary instanceof HTMLElement) {
      summary.hidden = true;
    }
    if (summaryList instanceof HTMLElement) {
      summaryList.innerHTML = '';
    }
  };

  const showSummary = (issues) => {
    if (!(summary instanceof HTMLElement) || !(summaryList instanceof HTMLElement)) {
      return;
    }

    summaryList.innerHTML = '';
    issues.forEach((issue) => {
      const item = document.createElement('li');
      if (issue.field && issue.field.id) {
        const link = document.createElement('a');
        link.href = `#${issue.field.id}`;
        link.textContent = issue.message;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          issue.field.focus();
        });
        item.append(link);
      } else {
        item.textContent = issue.message;
      }
      summaryList.append(item);
    });

    summary.hidden = false;
    summary.focus();
  };

  const hideSuccess = () => {
    if (success instanceof HTMLElement) {
      success.hidden = true;
    }
  };

  const updateCounter = () => {
    if (!(counter instanceof HTMLElement)) {
      return;
    }

    const max = Number.parseInt(counter.getAttribute('data-max') || '', 10) || 4000;
    const len = fields.request_details.value.length;
    counter.textContent = `${len}/${max}`;
    counter.toggleAttribute('data-near-limit', len >= Math.floor(max * 0.85) && len < max);
    counter.toggleAttribute('data-at-limit', len >= max);
  };

  const validate = () => {
    const issues = [];

    const nameValue = fields.full_name.value.trim();
    const emailValue = fields.email.value.trim();
    const phoneValue = fields.phone.value.trim();
    const detailsValue = fields.request_details.value.trim();
    const elapsed = Math.floor(Date.now() / 1000) - Number.parseInt(submittedAt.value, 10);

    setFieldError(fields.full_name, '');
    setFieldError(fields.email, '');
    setFieldError(fields.phone, '');
    setFieldError(fields.request_details, '');
    setFieldError(fields.confirmation, '');

    if (honeypot.value.trim() !== '') {
      issues.push({ field: null, message: 'Unable to submit this request.' });
      return issues;
    }

    if (!Number.isFinite(elapsed) || elapsed < MIN_SUBMIT_DELAY_SECONDS) {
      issues.push({ field: null, message: 'Please wait a few seconds before submitting.' });
      return issues;
    }

    if (nameValue.length < 2) {
      const message = 'Please enter your full name.';
      setFieldError(fields.full_name, message);
      issues.push({ field: fields.full_name, message });
    }

    if (!validEmail(emailValue)) {
      const message = 'Please enter a valid email address.';
      setFieldError(fields.email, message);
      issues.push({ field: fields.email, message });
    }

    if (phoneValue) {
      const digits = phoneValue.replace(/\D/g, '').length;
      if (digits < 7) {
        const message = 'Please enter a valid phone number or leave it blank.';
        setFieldError(fields.phone, message);
        issues.push({ field: fields.phone, message });
      }
    }

    if (detailsValue.length < 20) {
      const message = 'Please include at least 20 characters describing your request.';
      setFieldError(fields.request_details, message);
      issues.push({ field: fields.request_details, message });
    }

    if (!fields.confirmation.checked) {
      const message = 'You must confirm the deletion request before submitting.';
      setFieldError(fields.confirmation, message);
      issues.push({ field: fields.confirmation, message });
    }

    return issues;
  };

  [fields.full_name, fields.email, fields.phone, fields.request_details, fields.confirmation].forEach((field) => {
    field.addEventListener('input', () => {
      hideSummary();
      hideSuccess();
      setStatus('');
      if (field.getAttribute('aria-invalid') === 'true') {
        validate();
      }
      updateCounter();
    });
  });

  form.addEventListener('submit', async (event) => {
    const canAsync = typeof window.fetch === 'function' && typeof window.FormData === 'function';
    if (!canAsync) {
      return;
    }

    event.preventDefault();
    hideSummary();
    hideSuccess();

    const issues = validate();
    if (issues.length > 0) {
      showSummary(issues);
      setStatus('Please review the highlighted fields.', 'error');
      return;
    }

    submitButton.disabled = true;
    setStatus('Submitting your request...', '');

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok || !payload || payload.ok !== true) {
        throw new Error((payload && payload.error) || 'Submission failed. Please try again later.');
      }

      const referenceId = typeof payload.referenceId === 'string' && payload.referenceId ? payload.referenceId : referenceInput.value;

      if (success instanceof HTMLElement && successRef instanceof HTMLElement) {
        successRef.textContent = referenceId;
        success.hidden = false;
      }

      form.reset();
      setFieldError(fields.full_name, '');
      setFieldError(fields.email, '');
      setFieldError(fields.phone, '');
      setFieldError(fields.request_details, '');
      setFieldError(fields.confirmation, '');
      stampStarted();
      issueReference();
      updateCounter();
      setStatus('Your request was submitted successfully.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed. Please try again later.';
      showSummary([{ field: null, message }]);
      setStatus(message, 'error');
    } finally {
      submitButton.disabled = false;
    }
  });

  stampStarted();
  issueReference();
  updateCounter();
}
