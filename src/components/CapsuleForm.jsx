import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IngredientBuilder from './IngredientBuilder';
import { useFormulas } from '../hooks/useFormulas';
import { useIngredientHandlers } from '../hooks/useIngredientHandlers';
import { formatToGrams } from '../lib/formulas';

const CapsuleForm = ({ formData, setFormData, errors, touched, handleBlur }) => {
    const [totalWeight, setTotalWeight] = useState(0);
    const [capsuleCount, setCapsuleCount] = useState(0);
    const { formulas, loading, error } = useFormulas();
    const { handleInputChange, addIngredient, removeIngredient, updateIngredient } =
        useIngredientHandlers(setFormData, 'capsuleDetails');

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
