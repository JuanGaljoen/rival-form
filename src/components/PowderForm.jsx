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

const PowderForm = ({ formData, setFormData }) => {
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

    const [totalWeightPerServing, setTotalWeightPerServing] = useState(0);
    const [totalContainerWeight, setTotalContainerWeight] = useState(0);

    const getAvailableFormulas = (currentIndex) => {
        const selectedFormulas = formData.ingredients
            .filter((_, index) => index !== currentIndex)
            .map(ing => ing.formula);
        return formulas.filter(f => !selectedFormulas.includes(f.formula));
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
        if (totalWeightInGrams <= 300) return 2.80;
        if (totalWeightInGrams <= 500) return 4.00;
        if (totalWeightInGrams <= 1000) return 5.20;
        return 0;
    };

    const calculateTotal = () => {
        if (!formData.servings) return 0;

        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const formula = formulas.find(f => f.formula === ing.formula);
            const pricePerGram = formula ? formula.price : 0;
            const grams = (parseInt(ing.mg) || 0) / 1000; // Convert mg to g for price calculation
            return sum + (pricePerGram * grams);
        }, 0) * parseInt(formData.servings);

        const packagingCost = calculatePackagingCost(totalContainerWeight / 1000); // Convert mg to g
        const flavorCost = formData.flavorProfile === "natural" ? 2.50 :
            formData.flavorProfile === "artificial" ? 1.75 : 0;

        const singleContainerPrice = ingredientsCost + packagingCost + flavorCost;
        const quantity = parseInt(formData.quantity) || 1;

        return (singleContainerPrice * quantity).toFixed(2);
    };

    const calculateMaxServings = () => {
        if (totalWeightPerServing === 0) return 999;
        return Math.floor(1000 / (totalWeightPerServing / 1000)); // Convert mg to g
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
                {/* Flavor Profile Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold p-4">2. Choose Flavor Profile</h3>
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
                </div>

                {/* Servings Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Number of Servings per Container</h3>
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
                    />
                    {totalWeightPerServing > 0 && (
                        <div className="text-sm text-slate-600">
                            Maximum servings possible: {calculateMaxServings()}
                            (based on {totalWeightPerServing}mg per serving)
                        </div>
                    )}
                    {totalContainerWeight > 1000000 && ( // Convert limit to mg (1000g = 1,000,000mg)
                        <Alert variant="destructive">
                            <AlertDescription>
                                Total container weight ({totalContainerWeight}mg) exceeds 1000g limit.
                                Please reduce servings or ingredient amounts.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Formula Builder Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">5. Build Your Formula</h3>
                    <div className="space-y-4">
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="flex-1 min-w-0">
                                    <ComboboxDemo
                                        value={ingredient.formula}
                                        onChange={updateIngredient}
                                        index={index}
                                        formulas={getAvailableFormulas(index)}
                                    />
                                </div>
                                <Input
                                    type="number"
                                    value={ingredient.mg}
                                    onChange={(e) => updateIngredient(index, 'mg', e.target.value)}
                                    placeholder="mg"
                                    className="w-16 sm:w-24 shrink-0"
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
                            onClick={addIngredient}
                            variant="outline"
                            className="mt-2"
                            type="button"
                        >
                            Add Ingredient
                        </Button>
                    </div>
                    <p className="text-sm text-slate-600">
                        Total weight per container: {totalContainerWeight}mg
                    </p>
                </div>

                {/* Quantity Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">4. Quantity</h3>
                    <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity || ''}
                        onChange={handleInputChange}
                        placeholder="Enter number of containers"
                        className="max-w-xs"
                    />
                </div>

                {/* Summary Section */}
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
                                <p className="ml-4 text-sm text-slate-600">
                                    Total weight per serving: {totalWeightPerServing}mg
                                </p>
                            </div>
                        )}
                        {formData.servings && (
                            <>
                                <p>Servings per container: <span className="font-medium">{formData.servings}</span></p>
                                <p>Number of containers: <span className="font-medium">{formData.quantity}</span></p>
                                <p className="text-sm text-slate-600">
                                    Total weight per container: {totalContainerWeight}mg
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