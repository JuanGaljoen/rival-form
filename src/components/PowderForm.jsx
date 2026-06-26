import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IngredientBuilder from './IngredientBuilder';
import { useFormulas } from '../hooks/useFormulas';
import { useIngredientHandlers } from '../hooks/useIngredientHandlers';
import { formatToGrams } from '../lib/formulas';

const PowderForm = ({ formData, setFormData, errors, touched, handleBlur }) => {
    const [totalWeightPerServing, setTotalWeightPerServing] = useState(0);
    const [totalContainerWeight, setTotalContainerWeight] = useState(0);
    const { formulas, loading, error } = useFormulas();
    const { handleInputChange, addIngredient, removeIngredient, updateIngredient } =
        useIngredientHandlers(setFormData, 'powderDetails');

    useEffect(() => {
        const weightPerServing = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.mg) || 0), 0);
        setTotalWeightPerServing(weightPerServing);

        const containerWeight = weightPerServing * (parseInt(formData.servings) || 0);
        setTotalContainerWeight(containerWeight);
    }, [formData.ingredients, formData.servings]);

    const calculatePackagingCost = (totalWeightInGrams) => {
        const labor = 1.00; // Labor cost is constant

        if (totalWeightInGrams <= 300) {
            return {
                packagingItems: 1.243,  // bottle + lid + scoop + desiccant + box
                labor: labor,
                coPack: 4.00
            };
        } else if (totalWeightInGrams <= 500) {
            return {
                packagingItems: 1.243,  // Update this when you get correct pricing for 300-500g
                labor: labor,
                coPack: 4.50
            };
        } else if (totalWeightInGrams <= 1000) {
            return {
                packagingItems: 1.243,  // Update this when you get correct pricing for 500-1000g
                labor: labor,
                coPack: 5.00
            };
        } else {
            return {
                packagingItems: 0,
                labor: 0,
                coPack: 0
            };
        }
    };

    const calculateTotal = () => {
        if (!formData.servings) return 0;

        const servings = Number(formData.servings) > 0 ? Number(formData.servings) : 1;

        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const formula = formulas.find(f => f.formula === ing.formula);
            const pricePerGram = formula ? formula.price : 0;
            const grams = (parseFloat(ing.mg) || 0) / 1000;
            return sum + (pricePerGram * grams);
        }, 0) * servings;

        const totalWeightInGrams = totalContainerWeight / 1000;
        const packagingCosts = calculatePackagingCost(totalWeightInGrams);
        const totalPackagingCost = packagingCosts.packagingItems + packagingCosts.labor + packagingCosts.coPack;

        const flavorCost =
            formData.flavorProfile === "natural"
                ? 1.50
                : formData.flavorProfile === "artificial"
                    ? 1.75
                    : 0;

        const singleContainerPrice =
            ingredientsCost + totalPackagingCost + flavorCost;

        const quantity =
            Number(formData.quantity) > 0 ? Number(formData.quantity) : 1;

        return (Math.round(singleContainerPrice * quantity * 100) / 100).toFixed(2);
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
    }, [formData.ingredients, formData.servings, formData.quantity, formData.flavorProfile, formulas]);

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

    if (loading) {
        return <div>Loading formulas...</div>;
    }

    if (error) {
        return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
    }

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
                    <IngredientBuilder
                        ingredients={formData.ingredients}
                        formulas={formulas}
                        onUpdate={updateIngredient}
                        onRemove={removeIngredient}
                        onAdd={addIngredient}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                    />
                    <p className="text-sm text-slate-600">
                        Total weight per container: {formatToGrams(totalContainerWeight)}g
                    </p>
                </div>

                <div className="space-y-4 text-center">
                    <h3 className="text-lg font-semibold">Quantity</h3>

                    <div className="flex justify-center">
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
