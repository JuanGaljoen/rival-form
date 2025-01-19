import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ComboboxDemo from './ComboBox';
import formulas from '../data/formulas.json';
import { Trash2 } from "lucide-react";

const CapsuleForm = () => {
    const [formData, setFormData] = useState({
        servings: '',
        quantity: '1', // Number of bottles
        ingredients: [],
    });

    const [totalWeightPerServing, setTotalWeightPerServing] = useState(0);
    const [capsulesPerServing, setCapsulesPerServing] = useState(0);
    const [totalCapsulesPerBottle, setTotalCapsulesPerBottle] = useState(0);

    const getAvailableFormulas = (currentIndex) => {
        const selectedFormulas = formData.ingredients
            .filter((_, index) => index !== currentIndex)
            .map(ing => ing.formula);
        return formulas.filter(f => !selectedFormulas.includes(f.formula));
    };

    useEffect(() => {
        const weightPerServing = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.grams) || 0), 0);
        setTotalWeightPerServing(weightPerServing);

        // Calculate capsules needed per serving (600mg per capsule)
        const capsules = Math.ceil(weightPerServing / 0.6); // 0.6g = 600mg
        setCapsulesPerServing(capsules);

        // Calculate total capsules per bottle
        const totalCapsules = capsules * (parseInt(formData.servings) || 0);
        setTotalCapsulesPerBottle(totalCapsules);
    }, [formData.ingredients, formData.servings]);

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { formula: '', grams: '' }]
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const updateIngredient = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            )
        }));
    };

    const calculateBottleCost = (capsuleCount) => {
        if (capsuleCount <= 120) return 0.40;
        if (capsuleCount <= 299) return 0.80;
        return 1.25;
    };

    const calculateTotal = () => {
        if (!formData.servings) return 0;

        // Calculate ingredients cost
        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const formula = formulas.find(f => f.formula === ing.formula);
            const pricePerGram = formula ? formula.price : 0;
            return sum + (pricePerGram * (parseInt(ing.grams) || 0));
        }, 0) * parseInt(formData.servings);

        // Calculate capsule cost ($0.007 per capsule)
        const capsuleCost = totalCapsulesPerBottle * 0.007;

        // Calculate bottle cost based on total capsules
        const bottleCost = calculateBottleCost(totalCapsulesPerBottle);

        const singleBottlePrice = ingredientsCost + capsuleCost + bottleCost;
        const quantity = parseInt(formData.quantity) || 1;

        return (singleBottlePrice * quantity).toFixed(2);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-none border-none">
            <CardContent className="space-y-6 p-0">
                {/* Servings Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold p-4">2. Number of Servings per Bottle</h3>
                    <Input
                        type="number"
                        min="1"
                        value={formData.servings}
                        onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                        placeholder="Enter number of servings"
                        className="max-w-xs"
                    />
                </div>

                {/* Formula Builder Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">4. Build Your Formula</h3>
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
                                    value={ingredient.grams}
                                    onChange={(e) => updateIngredient(index, 'grams', e.target.value)}
                                    placeholder="g"
                                    className="w-16 sm:w-24 shrink-0"
                                    min="0.1"
                                    step="0.1"
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
                        >
                            Add Ingredient
                        </Button>
                    </div>
                    {totalWeightPerServing > 0 && (
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>Weight per serving: {totalWeightPerServing}g</p>
                            <p>Capsules per serving: {capsulesPerServing}</p>
                            <p>Total capsules per bottle: {totalCapsulesPerBottle}</p>
                        </div>
                    )}
                </div>


                {/* Quantity Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Number of Bottles</h3>
                    <Input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Enter number of bottles"
                        className="max-w-xs"
                    />
                </div>

                {/* Summary Section */}
                {formData.ingredients.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <p>Product Type: <span className="font-medium">Capsules</span></p>
                        {formData.ingredients.length > 0 && (
                            <div className="space-y-1">
                                <p className="font-medium">Ingredients per Serving:</p>
                                {formData.ingredients.map((ing, index) => (
                                    <p key={index} className="ml-4">
                                        • {ing.formula}: {ing.grams}g
                                    </p>
                                ))}
                                <p className="ml-4 text-sm text-slate-600">
                                    Total weight per serving: {totalWeightPerServing}g
                                    <br />
                                    Capsules per serving: {capsulesPerServing}
                                </p>
                            </div>
                        )}
                        {formData.servings && (
                            <>
                                <p>Servings per bottle: <span className="font-medium">{formData.servings}</span></p>
                                <p>Number of bottles: <span className="font-medium">{formData.quantity}</span></p>
                                <p className="text-sm text-slate-600">
                                    Total capsules per bottle: {totalCapsulesPerBottle}
                                </p>
                            </>
                        )}
                        {totalCapsulesPerBottle > 0 && formData.servings && (
                            <div className="mt-4 space-y-1">
                                <p className="text-lg font-semibold">Total Price: ${calculateTotal()}</p>
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