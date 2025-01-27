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
import { validateField } from '../lib/validators.jsx';

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

        Object.keys(basicDetails).forEach(key => {
            if (touched[key]) {
                const error = validateField(key, basicDetails[key], basicDetails);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
    }, [formData.basicDetails, touched]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        const basicDetails = formData.basicDetails;

        Object.keys(basicDetails).forEach(key => {
            const error = validateField(key, basicDetails[key], basicDetails);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const newTouched = {};
            Object.keys(basicDetails).forEach(key => {
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
                        />
                    }
                    {formData.productType === 'capsule' &&
                        <CapsuleForm
                            formData={formData.capsuleDetails}
                            setFormData={setFormData}
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