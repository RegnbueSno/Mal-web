const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
export const month = String(today.getMonth() + 1).padStart(2, '0');
export const dateString = `${month}-${day}`;
export const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

export function getDailyElement(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    let hash = (dateSeed * 16807) % 2147483647;
    const index = Math.abs(hash) % arr.length;
    return arr[index];
}