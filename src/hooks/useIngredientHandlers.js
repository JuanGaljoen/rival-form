// Returns the standard add/remove/update/field handlers for a product form,
// scoped to the given slice of formData (e.g. "powderDetails" or
// "capsuleDetails"). Shared by PowderForm and CapsuleForm.
export function useIngredientHandlers(setFormData, detailsKey) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [detailsKey]: {
                ...prev[detailsKey],
                [name]: value
            }
        }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            [detailsKey]: {
                ...prev[detailsKey],
                ingredients: [...(prev[detailsKey].ingredients || []), { formula: '', mg: '' }]
            }
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            [detailsKey]: {
                ...prev[detailsKey],
                ingredients: (prev[detailsKey].ingredients || []).filter((_, i) => i !== index)
            }
        }));
    };

    const updateIngredient = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [detailsKey]: {
                ...prev[detailsKey],
                ingredients: (prev[detailsKey].ingredients || []).map((ing, i) =>
                    i === index ? { ...ing, [field]: value } : ing
                )
            }
        }));
    };

    return { handleInputChange, addIngredient, removeIngredient, updateIngredient };
}
