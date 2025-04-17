import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PowderForm from './PowderForm';
import CapsuleForm from './CapsuleForm';
import BasicDetailsForm from './BasicDetailsForm';
import { validateField, validateFormula } from '../lib/validators.jsx';

const QuoteForm = () => {
    const initialFormState = {
        basicDetails: {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            companyName: '',
            companyWebsite: '',
            hasExistingProduct: '',
            existingProductLink: '',
            city: '',
            state: '',
            zipCode: '',
            productType: '',
        },
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
    };

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
        setTouched({});
        setCaptchaToken(null);
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        if (token) {
            setErrors((prev) => {
                const { recaptcha, ...rest } = prev;
                return rest;
            });
        }
    };

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

        if (formData.basicDetails.productType === 'powder') {
            Object.keys(powderDetails).forEach(key => {
                if (touched[key]) {
                    const error = validateField(key, powderDetails[key], powderDetails);
                    if (error) newErrors[key] = error;
                }
            });
            if (touched.ingredients || touched.formulaBuilder) {
                const formulaErrors = validateFormula(powderDetails.ingredients);
                if (formulaErrors.length > 0) {
                    newErrors.ingredients = formulaErrors[0];
                }
            }
        }

        if (formData.basicDetails.productType === 'capsule') {
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
    }, [formData.basicDetails, formData.powderDetails, formData.capsuleDetails, touched]);

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

        if (formData.basicDetails.productType === 'powder') {
            Object.keys(powderDetails).forEach(key => {
                const error = validateField(key, powderDetails[key], powderDetails);
                if (error) newErrors[key] = error;
            });
            const formulaErrors = validateFormula(powderDetails.ingredients);
            if (formulaErrors.length > 0) {
                newErrors.ingredients = formulaErrors[0];
            }
        }

        if (formData.basicDetails.productType === 'capsule') {
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
        if (!captchaToken) {
            setErrors(prev => ({
                ...prev,
                recaptcha: 'Please complete the reCAPTCHA verification'
            }));
            return;
        }
        const emailData = {
            basicDetails: formData.basicDetails,
            productType: formData.productType,
            powderDetails: formData.powderDetails,
            capsuleDetails: formData.capsuleDetails
        };

        try {
            console.log('Form data to send:', emailData);

            const response = await fetch(import.meta.env.VITE_LAMBDA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Email sent successfully:', result);
            alert('Your quote request has been sent.');
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
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

                    {formData.basicDetails.productType === 'powder' &&
                        <PowderForm
                            formData={formData.powderDetails}
                            setFormData={setFormData}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                        />
                    }

                    {formData.basicDetails.productType === 'capsule' &&
                        <CapsuleForm
                            formData={formData.capsuleDetails}
                            setFormData={setFormData}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                        />
                    }

                    <div className="flex justify-center items-center space-x-2 w-full sm:w-auto mx-auto">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_SITE_KEY}
                            onChange={handleCaptchaChange}
                        />
                    </div>
                    {errors.recaptcha && (
                        <p className="text-sm text-red-500">{errors.recaptcha}</p>
                    )}

                    <Button
                        type="submit"
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
