import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SupplementForm = () => {
    const [formData, setFormData] = useState({
        type: '',
        flavorProfile: '',
        servings: '',
        ingredients: [],
    });

    const [totalWeightPerServing, setTotalWeightPerServing] = useState(0);
    const [totalContainerWeight, setTotalContainerWeight] = useState(0);

    const formulas = {
        '5-HTP': 1.0,
        'Acai Fruit Ext 4:1': 1.5,
        'Acai Juice Powder': 2.2
    };

    const calculatePackagingCost = (totalWeightInGrams) => {
        if (totalWeightInGrams <= 300) return 2.80;
        if (totalWeightInGrams <= 500) return 4.00;
        if (totalWeightInGrams <= 1000) return 5.20;
        return 0;
    };

    useEffect(() => {
        const weightPerServing = formData.ingredients.reduce((sum, ing) =>
            sum + (parseInt(ing.grams) || 0), 0);
        setTotalWeightPerServing(weightPerServing);

        const containerWeight = weightPerServing * (parseInt(formData.servings) || 0);
        setTotalContainerWeight(containerWeight);
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

    const calculateTotal = () => {
        if (!formData.servings) return 0;

        // Calculate cost per container (all ingredients * servings)
        const ingredientsCost = formData.ingredients.reduce((sum, ing) => {
            const pricePerGram = formulas[ing.formula] || 0;
            return sum + (pricePerGram * (parseInt(ing.grams) || 0));
        }, 0) * parseInt(formData.servings);

        // Calculate packaging cost based on total container weight
        const packagingCost = calculatePackagingCost(totalContainerWeight);

        // Add flavor profile cost
        const flavorCost = formData.flavorProfile === "natural" ? 2.0 :
            formData.flavorProfile === "artificial" ? 1.75 : 0;

        return (ingredientsCost + packagingCost + flavorCost).toFixed(2);
    };

    const calculateMaxServings = () => {
        if (totalWeightPerServing === 0) return 999;
        return Math.floor(1000 / totalWeightPerServing);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Rival Labs Quote Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Product Type Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Choose Product Type</h3>
                    <RadioGroup
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                        value={formData.type}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="powder" id="powder" className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center checked:border-black checked:bg-black" />
                            <Label htmlFor="powder">Powder</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="capsule" id="capsule" className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center checked:border-black checked:bg-black" />
                            <Label htmlFor="capsule">Capsule</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="border-t border-gray-200" />

                {/* Flavor Profile Section */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-semibold">2. Choose Flavor Profile</h3>
                    <RadioGroup
                        onValueChange={(value) => setFormData(prev => ({ ...prev, flavorProfile: value }))}
                        value={formData.flavorProfile}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="natural" id="natural" className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center checked:border-black checked:bg-black" />
                            <Label htmlFor="natural">Natural</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="artificial" id="artificial" className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center checked:border-black checked:bg-black" />
                            <Label htmlFor="artificial">Artificial</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="border-t border-gray-200" />

                {/* Servings Section */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-semibold">4. Number of Servings</h3>
                    <Input
                        type="number"
                        min="1"
                        max={calculateMaxServings()}
                        value={formData.servings}
                        onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                        placeholder="Enter number of servings"
                        className="max-w-xs"
                    />
                    {totalWeightPerServing > 0 && (
                        <div className="text-sm text-slate-600">
                            Maximum servings possible: {calculateMaxServings()}
                            (based on {totalWeightPerServing}g per serving)
                        </div>
                    )}
                    {totalContainerWeight > 1000 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Total container weight ({totalContainerWeight}g) exceeds 1000g limit.
                                Please reduce servings or ingredient amounts.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Formula Builder Section */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-semibold">3. Build Your Formula</h3>
                    <div className="space-y-4">
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <Select
                                    value={ingredient.formula}
                                    onValueChange={(value) => updateIngredient(index, 'formula', value)}
                                >
                                    <SelectTrigger className="w-64">
                                        <SelectValue placeholder="Select ingredient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(formulas).map((formula) => (
                                            <SelectItem key={formula} value={formula}>
                                                {formula}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    value={ingredient.grams}
                                    onChange={(e) => updateIngredient(index, 'grams', e.target.value)}
                                    placeholder="Grams"
                                    className="w-24"
                                    min="1"
                                />
                                <Button
                                    variant="destructive"
                                    onClick={() => removeIngredient(index)}
                                    className="px-2"
                                >
                                    X
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

                        {totalWeightPerServing > 0 && (
                            <div className="text-sm text-slate-600">
                                Total weight per serving: {totalWeightPerServing}g
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Summary Section */}
                {(formData.type || formData.flavorProfile || formData.ingredients.length > 0) && (
                    <>
                        <div className="border-t border-gray-200" />
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 mt-4">
                            <h3 className="text-lg font-semibold">Order Summary</h3>
                            {formData.type && (
                                <p>Type: <span className="font-medium">{formData.type}</span></p>
                            )}
                            {formData.flavorProfile && (
                                <p>Flavor Profile: <span className="font-medium">{formData.flavorProfile}</span></p>
                            )}
                            {formData.ingredients.length > 0 && (
                                <div className="space-y-1">
                                    <p className="font-medium">Ingredients per serving:</p>
                                    {formData.ingredients.map((ing, index) => (
                                        <p key={index} className="ml-4">
                                            • {ing.formula}: {ing.grams}g
                                        </p>
                                    ))}
                                    <p className="ml-4 text-sm text-slate-600">
                                        Total weight per serving: {totalWeightPerServing}g
                                    </p>
                                </div>
                            )}
                            {formData.servings && (
                                <>
                                    <p>Number of servings: <span className="font-medium">{formData.servings}</span></p>
                                    <p className="text-sm text-slate-600">
                                        Total container weight: {totalContainerWeight}g
                                    </p>
                                </>
                            )}
                            {totalContainerWeight > 0 && formData.servings && (
                                <div className="mt-4 space-y-1">
                                    <p className="text-lg font-semibold">Total Price: ${calculateTotal()}</p>
                                    <p className="text-sm text-slate-600">
                                        Packaging size: {
                                            totalContainerWeight <= 300 ? "300g" :
                                                totalContainerWeight <= 500 ? "500g" :
                                                    totalContainerWeight <= 1000 ? "1000g" : "Exceeds limit"
                                        } (${calculatePackagingCost(totalContainerWeight)})
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default SupplementForm;