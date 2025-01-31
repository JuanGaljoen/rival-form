export const validateField = (name, value, allValues) => {
    switch (name) {
        case 'firstName':
        case 'lastName':
            return value.trim() ? '' : 'This field is required';

        case 'email':
            if (!value.trim()) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address';
            }
            return '';

        case 'confirmEmail':
            if (!value.trim()) return 'Please confirm your email';
            if (value !== allValues.email) {
                return 'Emails do not match';
            }
            return '';

        case 'companyName':
            return value.trim() ? '' : 'Company name is required';

        case 'companyWebsite':
            if (!value) return ''; // Optional field
            if (!/^https?:\/\/.+\..+/.test(value)) {
                return 'Please enter a valid URL (include http:// or https://)';
            }
            return '';

        case 'city':
            return value.trim() ? '' : 'City is required';

        case 'state':
            if (!value.trim()) return 'State is required';
            if (!/^[A-Za-z]{2}$/.test(value)) {
                return 'Please use 2-letter state code';
            }
            return '';

        case 'zipCode':
            if (!value.trim()) return 'ZIP code is required';
            if (!/^\d{5}(-\d{4})?$/.test(value)) {
                return 'Please enter a valid ZIP code';
            }
            return '';

        case 'hasExistingProduct':
            return value ? '' : 'Please select an option';

        case 'productType':
            return value ? '' : 'Please select a product type';

        case 'flavorProfile':
            return value ? '' : 'Please select an option';

        case 'ingredients':
            if (!Array.isArray(value) || value.length === 0) {
                return 'At least one ingredient is required';
            }

            for (let i = 0; i < value.length; i++) {
                const ingredient = value[i];
                if (!ingredient.formula) {
                    return `Please select an ingredient for row ${i + 1}`;
                }
                if (!ingredient.mg || parseInt(ingredient.mg) <= 0) {
                    return `Please enter a valid weight for ${ingredient.formula || 'row ' + (i + 1)}`;
                }
            }
            return '';

        default:
            return '';
    }
};

export const validateFormula = (ingredients) => {
    const errors = [];

    if (!ingredients || ingredients.length === 0) {
        errors.push('At least one ingredient is required');
        return errors;
    }

    ingredients.forEach((ingredient, index) => {
        if (!ingredient.formula) {
            errors.push(`Please select an ingredient for row ${index + 1}`);
        }
        if (!ingredient.mg || parseInt(ingredient.mg) <= 0) {
            errors.push(`Please enter a valid weight for ${ingredient.formula || 'row ' + (index + 1)}`);
        }
    });

    return errors;
};