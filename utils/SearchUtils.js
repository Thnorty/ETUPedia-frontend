export const customFilter = (data, searchTerm) => {
  return data.replace(/[ıİ]/g, 'i').replace('i̇', 'i').toLowerCase()
    .includes(searchTerm.replace(/[ıİ]/g, 'i').replace('i̇', 'i').toLowerCase());
}
