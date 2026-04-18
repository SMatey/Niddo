/**
 * Extracts numeric value from price strings like "$850/mes" or "$1,200/mes"
 * Returns NaN if the string contains no digits.
 */
export function parsePrice(price: string): number {
    const cleaned = price.replace(/[^0-9]/g, '')
    return cleaned === '' ? NaN : parseInt(cleaned, 10)
}