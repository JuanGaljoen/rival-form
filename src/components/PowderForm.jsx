import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ComboboxDemo from './ComboBox';
import formulas from '../data/formulas.json';
import { Trash2 } from "lucide-react";

const PowderForm = ({ formData, setFormData, errors, touched, handleBlur }) => {
    const [totalWeightPerServing, setTotalWeightPerServing] = useState(0);
    const [totalContainerWeight, setTotalContainerWeight] = useState(0);

    const formatToGrams = (mg) => (mg / 1000).toFixed(2);

    const getAvailableFormulas = (currentIndex) => {
        const selectedFormulas = formData.ingredients
            .filter((_, index) => index !== currentIndex)
            .map(ing => ing.formula);
        return formulas.filter(f => !selectedFormulas.includes(f.formula));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                [name]: value
            }
        }));
    };

    useEffect(() => {
        const weightPerServing = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.mg) || 0), 0);
        setTotalWeightPerServing(weightPerServing);

        const containerWeight = weightPerServing * (parseInt(formData.servings) || 0);
        setTotalContainerWeight(containerWeight);
    }, [formData.ingredients, formData.servings]);

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                ingredients: [...(prev.powderDetails.ingredients || []), { formula: '', mg: '' }]
            }
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                ingredients: (prev.powderDetails.ingredients || []).filter((_, i) => i !== index)
            }
        }));
    };

    const updateIngredient = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                ingredients: (prev.powderDetails.ingredients || []).map((ing, i) =>
                    i === index ? { ...ing, [field]: value } : ing
                )
            }
        }));
    };

    const calculatePackagingCost = (totalWeightInGrams) => {
        if (totalWeightInGrams <= 300) return 6.90;
        if (totalWeightInGrams <= 500) return 7.70;
        if (totalWeightInGrams <= 1000) return 9.00;
        return 0;
    };

    const calculateTotal = () => {
        if (!formData.servings) return 0;

        // Calculate ingredients cost per serving and multiply by number of servings
        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const formula = formulas.find(f => f.formula === ing.formula);
            const pricePerGram = formula ? formula.price : 0;
            const grams = (parseInt(ing.mg) || 0) / 1000; // Convert mg to grams
            return sum + (pricePerGram * grams);
        }, 0) * parseInt(formData.servings); // Multiply by number of servings

        // Packaging cost based on weight (includes bottle, lid, box, scoop)
        const packagingCost = calculatePackagingCost(totalContainerWeight / 1000);

        const flavorCost = formData.flavorProfile === "natural" ? 1.50 :
            formData.flavorProfile === "artificial" ? 1.75 : 0;

        const singleContainerPrice = ingredientsCost + packagingCost + flavorCost;
        const quantity = parseInt(formData.quantity) || 1;

        return (singleContainerPrice * quantity).toFixed(2);
    };

    const calculateMaxServings = () => {
        if (totalWeightPerServing === 0) return 999;
        return Math.floor(1000 / (totalWeightPerServing / 1000));
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                totalCost: parseFloat(calculateTotal())
            }
        }));
    }, [formData.ingredients, formData.servings, formData.quantity, formData.flavorProfile]);

    useEffect(() => {
        const weightPerServing = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.mg) || 0), 0);
        setTotalWeightPerServing(weightPerServing);

        const containerWeight = weightPerServing * (parseInt(formData.servings) || 0);
        setTotalContainerWeight(containerWeight);

        setFormData(prev => ({
            ...prev,
            powderDetails: {
                ...prev.powderDetails,
                totalIngredientWeight: containerWeight
            }
        }));
    }, [formData.ingredients, formData.servings]);

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
            <CardContent className="space-y-6 p-0">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold p-4">Choose Flavor Profile</h3>
                    <RadioGroup
                        onValueChange={(value) => {
                            setFormData(prev => ({
                                ...prev,
                                powderDetails: {
                                    ...prev.powderDetails,
                                    flavorProfile: value
                                }
                            }));
                        }}
                        value={formData.flavorProfile}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="natural" id="natural" />
                            <Label htmlFor="natural">Natural</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="artificial" id="artificial" />
                            <Label htmlFor="artificial">Artificial</Label>
                        </div>
                    </RadioGroup>
                    {errors.flavorProfile && touched.flavorProfile &&
                        <p className="text-sm text-red-500">{errors.flavorProfile}</p>
                    }
                </div>

                <div className="space-y-4 text-center">
                    <h3 className="text-lg font-semibold">Number of Servings per Container</h3>

                    <div className="flex justify-center">
                        <Input
                            id="servings"
                            name="servings"
                            type="number"
                            min="1"
                            max={calculateMaxServings()}
                            value={formData.servings || ''}
                            onChange={handleInputChange}
                            placeholder="Enter number of servings"
                            className="max-w-xs"
                            required
                        />
                    </div>

                    {totalWeightPerServing > 0 && (
                        <div className="text-sm text-slate-600">
                            Maximum servings possible: {calculateMaxServings()} (based on {totalWeightPerServing}mg per serving)
                        </div>
                    )}

                    {totalContainerWeight > 1000000 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Total container weight ({totalContainerWeight}mg) exceeds 1000g limit.
                                Please reduce servings or ingredient amounts.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

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
                    <p className="text-sm text-slate-600">
                        Total weight per container: {formatToGrams(totalContainerWeight)}g
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quantity</h3>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity || ''}
                            onChange={handleInputChange}
                            placeholder="Enter number of containers"
                            className="max-w-xs"
                            required
                        />
                    </div>
                </div>

                {(formData.flavorProfile || formData.ingredients.length > 0) && (
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <p>Product Type: <span className="font-medium">Powder</span></p>
                        {formData.flavorProfile && (
                            <p>Flavor Profile: <span className="font-medium">{formData.flavorProfile}</span></p>
                        )}
                        {formData.ingredients.length > 0 && (
                            <div className="space-y-1">
                                <p className="font-medium">Ingredients per Container:</p>
                                {formData.ingredients.map((ing, index) => (
                                    <p key={index} className="ml-4">
                                        • {ing.formula}: {ing.mg}mg
                                    </p>
                                ))}
                                {/* <p className="ml-4 text-sm text-slate-600">
                                    Total weight per serving: {totalWeightPerServing}mg
                                </p> */}
                            </div>
                        )}
                        {formData.servings && (
                            <>
                                <p>Servings per container: <span className="font-medium">{formData.servings}</span></p>
                                <p>Number of containers: <span className="font-medium">{formData.quantity}</span></p>
                                <p className="text-sm text-slate-600">
                                    Total weight per container: {formatToGrams(totalContainerWeight)}g
                                </p>
                            </>
                        )}
                        {totalContainerWeight > 0 && formData.servings && (
                            <div className="mt-4 space-y-1">
                                <p className="text-lg font-semibold">Total Price: ${calculateTotal()}</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PowderForm;