import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ComboboxDemo from './ComboBox';
import { Trash2 } from "lucide-react";
import { getAvailableFormulas } from '../lib/formulas';

// The shared "Build Your Formula" ingredient-row list used by both the powder
// and capsule forms: a combobox + mg input + remove button per row, plus the
// add button and validation message.
const IngredientBuilder = ({
    ingredients,
    formulas,
    onUpdate,
    onRemove,
    onAdd,
    errors,
    touched,
    handleBlur,
}) => {
    return (
        <div className="space-y-4">
            {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-start space-x-4">
                    <div className="flex-1 min-w-0">
                        <ComboboxDemo
                            value={ingredient.formula}
                            onChange={(index, field, value) => {
                                onUpdate(index, field, value);
                                handleBlur({ target: { name: 'ingredients' } });
                            }}
                            index={index}
                            formulas={getAvailableFormulas(ingredients, formulas, index)}
                        />
                    </div>
                    <Input
                        type="number"
                        value={ingredient.mg}
                        onChange={(e) => {
                            onUpdate(index, 'mg', e.target.value);
                            handleBlur({ target: { name: 'ingredients' } });
                        }}
                        placeholder="mg"
                        className={`w-16 sm:w-24 shrink-0 ${errors.ingredients && !ingredient.mg ? 'border-red-500' : ''
                            }`}
                        min="1"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onRemove(index)}
                        className="p-2 shrink-0"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
            ))}

            <Button
                onClick={() => {
                    onAdd();
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
    );
};

export default IngredientBuilder;
