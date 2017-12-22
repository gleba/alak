export const deleteParams = o => {
    Object.keys(o).forEach(k => {
        if (o[k]) o[k] = null
        delete o[k]
    })
}


export function remove(target, value) {
    let idx = target.indexOf(value);
    if (idx != -1) {
        // Второй параметр - число элементов, которые необходимо удалить
        return target.splice(idx, 1);
    }
    return false;
}

