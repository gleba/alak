
export const deepClone = v =>
  v === "object" ? JSON.parse(JSON.stringify(v)) : v;

export const deleteParams = o => {
  Object.keys(o).forEach(k => {
    if (o[k]) o[k] = null;
    delete o[k];
  });
};

export function remove(target, value) {
  target.forEach((v, i) => {
    if (v[1] == value) {
      return target.splice(i, 1);
    }
  });
  return false;
}
