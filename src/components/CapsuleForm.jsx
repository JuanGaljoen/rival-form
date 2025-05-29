import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ComboboxDemo from './ComboBox';
import { Trash2 } from "lucide-react";
import Papa from 'papaparse';

const CapsuleForm = ({ formData, setFormData, errors, touched, handleBlur }) => {
    const [totalWeight, setTotalWeight] = useState(0);
    const [capsuleCount, setCapsuleCount] = useState(0);
    const [formulas, setFormulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatToGrams = (mg) => (mg / 1000).toFixed(2);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
                const response = await fetch(googleSheetUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
                }
                const text = await response.text();
                const result = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                });
                if (result.errors.length > 0) {
                    console.error('PapaParse errors:', result.errors);
                    throw new Error('Failed to parse CSV data');
                }
                const parsedFormulas = result.data
                    .map(row => ({
                        formula: row.ingredient || '',
                        price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
                    }))
                    .filter(formula => formula.formula);
                setFormulas(parsedFormulas);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Google Sheet:', err);
                setError(`Failed to load formulas: ${err.message}`);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            capsuleDetails: {
                ...prev.capsuleDetails,
                [name]: value
            }
        }));
    };

    const getAvailableFormulas = (currentIndex) => {
        const selectedFormulas = formData.ingredients
            .filter((_, index) => index !== currentIndex)
            .map(ing => ing.formula)
            .filter(formula => formula);
        const availableFormulas = formulas.filter(f => !selectedFormulas.includes(f.formula));
        return availableFormulas;
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            capsuleDetails: {
                ...prev.capsuleDetails,
                ingredients: [...(prev.capsuleDetails.ingredients || []), { formula: '', mg: '' }]
            }
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            capsuleDetails: {
                ...prev.capsuleDetails,
                ingredients: (prev.capsuleDetails.ingredients || []).filter((_, i) => i !== index)
            }
        }));
    };

    const updateIngredient = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            capsuleDetails: {
                ...prev.capsuleDetails,
                ingredients: (prev.capsuleDetails.ingredients || []).map((ing, i) =>
                    i === index ? { ...ing, [field]: value } : ing
                )
            }
        }));
    };

    const calculateBottleCost = (capsuleCount) => {
        if (capsuleCount <= 120) return 0.40;
        if (capsuleCount <= 299) return 0.80;
        return 1.25;
    };

    const calculateTotal = () => {
        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const formula = formulas.find(f => f.formula === ing.formula);
            const pricePerGram = formula ? formula.price : 0;
            const grams = (parseInt(ing.mg) || 0) / 1000;
            return sum + (pricePerGram * grams);
        }, 0);

        const capsuleCost = capsuleCount * 0.007;
        const bottleCost = calculateBottleCost(capsuleCount);
        const singleBottlePrice = ingredientsCost + capsuleCost + bottleCost;
        const quantity = parseInt(formData.quantity) || 1;

        return (singleBottlePrice * quantity).toFixed(2);
    };

    useEffect(() => {
        const weightInMg = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.mg) || 0), 0);
        setTotalWeight(weightInMg);

        const capsules = Math.ceil(weightInMg / 600);
        setCapsuleCount(capsules);

        setFormData(prev => ({
            ...prev,
            capsuleDetails: {
                ...prev.capsuleDetails,
                totalIngredientWeight: weightInMg,
                totalCapsules: capsules,
                totalCost: parseFloat(calculateTotal())
            }
        }));
    }, [formData.ingredients, formData.quantity, formulas]);

    // Show loading state
    if (loading) {
        return <div>Loading formulas...</div>;
    }

    // Show error state
    if (error) {
        return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-none border-none">
            <CardContent className="space-y-6 p-0">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Build Your Formula</h3>
                    <div className="space-y-4">
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="flex-1 min-w-0">
                                    <ComboboxDemo
                                        value={ingredient.formula}
                                        onChange={(index, field, value) => {
                                            updateIngredient(index, field, value);
                                            handleBlur({ target: { name: 'ingredients' } });
                                        }}
                                        index={index}
                                        formulas={getAvailableFormulas(index)}
                                    />
                                </div>
                                <Input
                                    type="number"
                                    value={ingredient.mg}
                                    onChange={(e) => {
                                        updateIngredient(index, 'mg', e.target.value);
                                        handleBlur({ target: { name: 'ingredients' } });
                                    }}
                                    placeholder="mg"
                                    className={`w-16 sm:w-24 shrink-0 ${errors.ingredients && !ingredient.mg ? 'border-red-500' : ''
                                        }`}
                                    min="1"
                                />
                                <Button
                                    variant="destructive"
                                    onClick={() => removeIngredient(index)}
                                    className="p-2 shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                </Button>
                            </div>
                        ))}

                        <Button
                            onClick={() => {
                                addIngredient();
                                handleBlur({ target: { name: 'ingredients' } });
                            }}
                            variant="outline"
                            className="mt-2"
                            type="button"
                        >
                            Add Ingredient
                        </Button>
                        {errors.ingredients && touched.ingredients && (
                            <p className="text-sm text-red-500">{errors.ingredients}</p>
                        )}

                    </div>
                    {totalWeight > 0 && (
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>Total weight per bottle: {formatToGrams(totalWeight)}g</p>
                            <p>Number of capsules: {capsuleCount} (600mg per capsule)</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Number of Bottles</h3>
                    <div className='flex justify-center'>
                        <Input
                            type="number"
                            name="quantity"
                            min="1"
                            value={formData.quantity || ''}
                            onChange={handleInputChange}
                            placeholder="Enter number of bottles"
                            className="max-w-xs"
                            required
                        />
                    </div>
                </div>

                {formData.ingredients.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <p>Product Type: <span className="font-medium">Capsules</span></p>
                        <div className="space-y-1">
                            <p className="font-medium">Ingredients:</p>
                            {formData.ingredients.map((ing, index) => (
                                <p key={index} className="ml-4">
                                    • {ing.formula}: {ing.mg}mg
                                </p>
                            ))}
                            <p className="ml-4 text-sm text-slate-600">
                                Total weight per bottle: {formatToGrams(totalWeight)}g
                                <br />
                                Number of capsules: {capsuleCount}
                            </p>
                        </div>
                        <p>Number of bottles: <span className="font-medium">{formData.quantity}</span></p>
                        {capsuleCount > 0 && (
                            <div className="mt-4 space-y-1">
                                <p className="text-lg font-semibold">Total Price: ${formData.totalCost}</p>
                                <p className="text-sm text-slate-600">
                                    (For {formData.quantity} bottle{parseInt(formData.quantity) > 1 ? 's' : ''})
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CapsuleForm;