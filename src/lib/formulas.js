// Shared helpers for the powder/capsule formula builders.

export const formatToGrams = (mg) => (mg / 1000).toFixed(2);

// Returns the formulas still selectable for a given row, excluding ones already
// chosen in other rows so each ingredient can only be picked once.
export const getAvailableFormulas = (ingredients, formulas, currentIndex) => {
    const selectedFormulas = ingredients
        .filter((_, index) => index !== currentIndex)
        .map(ing => ing.formula)
        .filter(formula => formula);
    return formulas.filter(f => !selectedFormulas.includes(f.formula));
};
