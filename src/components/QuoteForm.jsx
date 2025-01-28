import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PowderForm from './PowderForm';
import CapsuleForm from './CapsuleForm';
import BasicDetailsForm from './BasicDetailsForm';
import { validateField, validateFormula } from '../lib/validators.jsx';

const QuoteForm = () => {
    const [formData, setFormData] = useState({
        basicDetails: {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            companyName: '',
            companyWebsite: '',
            hasExistingProduct: '',
            city: '',
            state: '',
            zipCode: ''
        },
        productType: '',
        powderDetails: {
            flavorProfile: '',
            servings: '',
            quantity: '',
            ingredients: [],
            totalCost: 0,
            totalIngredientWeight: 0,
        },
        capsuleDetails: {
            quantity: '',
            ingredients: [],
            totalCost: 0,
            totalCapsules: 0,
            totalIngredientWeight: 0,
        }
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    useEffect(() => {
        const newErrors = {};
        const basicDetails = formData.basicDetails;
        const powderDetails = formData.powderDetails;
        const capsuleDetails = formData.capsuleDetails;

        Object.keys(basicDetails).forEach(key => {
            if (touched[key]) {
                const error = validateField(key, basicDetails[key], basicDetails);
                if (error) newErrors[key] = error;
            }
        });

        // Validation for powder details only if product type is "powder"
        if (formData.productType === 'powder') {
            Object.keys(powderDetails).forEach(key => {
                if (touched[key]) {
                    const error = validateField(key, powderDetails[key], powderDetails);
                    if (error) newErrors[key] = error;
                }
            });
            if (touched.ingredients || touched.formulaBuilder) {
                const formulaErrors = validateFormula(powderDetails.ingredients);
                if (formulaErrors.length > 0) {
                    newErrors.ingredients = formulaErrors[0]; // Show first error
                }
            }
        }

        // Validation for capsule details only if product type is "capsule"
        if (formData.productType === 'capsule') {
            Object.keys(capsuleDetails).forEach(key => {
                if (touched[key]) {
                    const error = validateField(key, capsuleDetails[key], capsuleDetails);
                    if (error) newErrors[key] = error;
                }
            });
            if (touched.ingredients || touched.formulaBuilder) {
                const formulaErrors = validateFormula(capsuleDetails.ingredients);
                if (formulaErrors.length > 0) {
                    newErrors.ingredients = formulaErrors[0];
                }
            }
        }

        setErrors(newErrors);
    }, [formData.basicDetails, formData.powderDetails, formData.capsuleDetails, touched, formData.productType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        const basicDetails = formData.basicDetails;
        const powderDetails = formData.powderDetails;
        const capsuleDetails = formData.capsuleDetails;

        Object.keys(basicDetails).forEach(key => {
            const error = validateField(key, basicDetails[key], basicDetails);
            if (error) newErrors[key] = error;
        });

        // Validation for powder details only if product type is "powder"
        if (formData.productType === 'powder') {
            Object.keys(powderDetails).forEach(key => {
                const error = validateField(key, powderDetails[key], powderDetails);
                if (error) newErrors[key] = error;
            });
            const formulaErrors = validateFormula(powderDetails.ingredients);
            if (formulaErrors.length > 0) {
                newErrors.ingredients = formulaErrors[0];
            }
        }

        // Validation for capsule details only if product type is "capsule"
        if (formData.productType === 'capsule') {
            Object.keys(capsuleDetails).forEach(key => {
                const error = validateField(key, capsuleDetails[key], capsuleDetails);
                if (error) newErrors[key] = error;
            });
            const formulaErrors = validateFormula(capsuleDetails.ingredients);
            if (formulaErrors.length > 0) {
                newErrors.ingredients = formulaErrors[0];
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const newTouched = {};
            Object.keys(basicDetails).forEach(key => {
                newTouched[key] = true;
            });
            Object.keys(powderDetails).forEach(key => {
                newTouched[key] = true;
            });
            Object.keys(capsuleDetails).forEach(key => {
                newTouched[key] = true;
            });
            setTouched(newTouched);
            return;
        }

        const emailData = {
            basicDetails: formData.basicDetails,
            productType: formData.productType,
            powderDetails: formData.powderDetails,
            capsuleDetails: formData.capsuleDetails
        };

        console.log('Form data to send:', emailData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="space-y-6 p-6">
                    <BasicDetailsForm
                        formData={formData.basicDetails}
                        setFormData={setFormData}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                    />
                    {/* Product Type Selection */}
                    <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold">Choose Product Type</h3>
                        <RadioGroup
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                productType: value
                            }))}
                            value={formData.productType}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="powder" id="powder" />
                                <Label htmlFor="powder">Powder</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="capsule" id="capsule" />
                                <Label htmlFor="capsule">Capsule</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {formData.productType === 'powder' &&
                        <PowderForm
                            formData={formData.powderDetails}
                            setFormData={setFormData}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                        />
                    }
                    {formData.productType === 'capsule' &&
                        <CapsuleForm
                            formData={formData.capsuleDetails}
                            setFormData={setFormData}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                        />
                    }
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={Object.keys(errors).length > 0}
                    >
                        Submit Quote Request
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default QuoteForm;
