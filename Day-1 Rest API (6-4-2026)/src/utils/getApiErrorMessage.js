const getApiErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail

  if (typeof detail === 'string' && detail.trim()) return detail

  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (typeof d?.msg === 'string' ? d.msg : null))
      .filter(Boolean)

    if (msgs.length) return msgs.join(', ')
  }

  if (!err?.response) {
    return 'API not reachable (is the backend running on http://localhost:8000?)'
  }

  return fallback
}

export default getApiErrorMessage
