export const customFilter = (data, searchTerm) => {
  return data.replace(/[ıİ]/g, 'i').replace(/i̇/g, 'i').toLowerCase()
    .includes(searchTerm.replace(/[ıİ]/g, 'i').replace(/i̇/g, 'i').toLowerCase());
}
