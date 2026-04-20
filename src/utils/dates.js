export function toDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = `${d.getFullYear()}`.padStart(4, '0');
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function fromDateInputValue(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  // API expects date-time; send midnight local.
  return new Date(`${yyyyMmDd}T00:00:00`).toISOString();
}

