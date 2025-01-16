import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PowderForm from './PowderForm';
import CapsuleForm from './CapsuleForm';

const QuoteForm = () => {
    const [type, setType] = useState('');
    const [formData, setFormData] = useState({
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
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                return value.trim() ? '' : 'This field is required';

            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Please enter a valid email address';
                }
                return '';

            case 'confirmEmail':
                if (!value.trim()) return 'Please confirm your email';
                if (value !== formData.email) {
                    return 'Emails do not match';
                }
                return '';

            case 'companyName':
                return value.trim() ? '' : 'Company name is required';

            case 'companyWebsite':
                if (!value) return ''; // Optional field
                if (!/^https?:\/\/.+\..+/.test(value)) {
                    return 'Please enter a valid URL (include http:// or https://)';
                }
                return '';

            case 'city':
                return value.trim() ? '' : 'City is required';

            case 'state':
                if (!value.trim()) return 'State is required';
                if (!/^[A-Za-z]{2}$/.test(value)) {
                    return 'Please use 2-letter state code';
                }
                return '';

            case 'zipCode':
                if (!value.trim()) return 'ZIP code is required';
                if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    return 'Please enter a valid ZIP code';
                }
                return '';

            case 'hasExistingProduct':
                return value ? '' : 'Please select an option';

            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Validate fields when values change
    useEffect(() => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (touched[key]) {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
    }, [formData, touched]);

    const getInputClassName = (fieldName) => {
        return `${errors[fieldName] && touched[fieldName] ? 'border-red-500 focus:border-red-500' : ''}`;
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="space-y-6 p-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('firstName')}
                                required
                            />
                            {errors.firstName && touched.firstName &&
                                <p className="text-sm text-red-500">{errors.firstName}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('lastName')}
                                required
                            />
                            {errors.lastName && touched.lastName &&
                                <p className="text-sm text-red-500">{errors.lastName}</p>
                            }
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('email')}
                                required
                            />
                            {errors.email && touched.email &&
                                <p className="text-sm text-red-500">{errors.email}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmEmail">Confirm Email Address</Label>
                            <Input
                                id="confirmEmail"
                                name="confirmEmail"
                                type="email"
                                value={formData.confirmEmail}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('confirmEmail')}
                                required
                            />
                            {errors.confirmEmail && touched.confirmEmail &&
                                <p className="text-sm text-red-500">{errors.confirmEmail}</p>
                            }
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('companyName')}
                                required
                            />
                            {errors.companyName && touched.companyName &&
                                <p className="text-sm text-red-500">{errors.companyName}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyWebsite">Company Website</Label>
                            <Input
                                id="companyWebsite"
                                name="companyWebsite"
                                type="url"
                                placeholder="https://"
                                value={formData.companyWebsite}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('companyWebsite')}
                            />
                            {errors.companyWebsite && touched.companyWebsite &&
                                <p className="text-sm text-red-500">{errors.companyWebsite}</p>
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('city')}
                                required
                            />
                            {errors.city && touched.city &&
                                <p className="text-sm text-red-500">{errors.city}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('state')}
                                placeholder="CA"
                                maxLength={2}
                                required
                            />
                            {errors.state && touched.state &&
                                <p className="text-sm text-red-500">{errors.state}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={getInputClassName('zipCode')}
                                placeholder="12345"
                                required
                            />
                            {errors.zipCode && touched.zipCode &&
                                <p className="text-sm text-red-500">{errors.zipCode}</p>
                            }
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Do you have an existing product line?</Label>
                    <RadioGroup
                        onValueChange={(value) => {
                            setFormData(prev => ({
                                ...prev,
                                hasExistingProduct: value
                            }));
                            setTouched(prev => ({
                                ...prev,
                                hasExistingProduct: true
                            }));
                        }}
                        value={formData.hasExistingProduct}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="existingYes" />
                            <Label htmlFor="existingYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="existingNo" />
                            <Label htmlFor="existingNo">No</Label>
                        </div>
                    </RadioGroup>
                    {errors.hasExistingProduct && touched.hasExistingProduct &&
                        <p className="text-sm text-red-500">{errors.hasExistingProduct}</p>
                    }
                </div>

                {/* Product Type Section */}
                <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-semibold">Choose Product Type</h3>
                    <RadioGroup
                        onValueChange={setType}
                        value={type}
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

                {type === 'powder' && <PowderForm />}
                {type === 'capsule' && <CapsuleForm />}
            </CardContent>
        </Card>
    );
};

export default QuoteForm;