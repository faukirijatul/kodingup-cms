export function buildQueryString(query: string | object) {
  if (typeof query === 'string')
    return query ? `?${query.replace(/^\?/, '')}` : '';

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === '') return;

    const items = Array.isArray(value) ? value : [value];
    items.forEach((item) => {
      if (item != null && item !== '') params.append(key, String(item));
    });
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}
