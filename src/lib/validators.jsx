export const validateField = (name, value) => {
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
            if (value !== formData.email) {
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

        default:
            return '';
    }
};

