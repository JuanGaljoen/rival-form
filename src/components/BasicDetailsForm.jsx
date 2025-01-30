import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BasicDetailsForm = ({ formData, setFormData, errors, touched, handleBlur }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            basicDetails: {
                ...prev.basicDetails,
                [name]: value
            }
        }));
    };

    const getInputClassName = (fieldName) => {
        return `${errors[fieldName] && touched[fieldName] ? 'border-red-500 focus:border-red-500' : ''}`;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
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
                        value={formData.lastName || ''}
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
                        value={formData.email || ''}
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
                        value={formData.confirmEmail || ''}
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
                        value={formData.companyName || ''}
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
                        value={formData.companyWebsite || ''}
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
                        value={formData.city || ''}
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
                        value={formData.state || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getInputClassName('state')}
                        placeholder="TX"
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
                        value={formData.zipCode || ''}
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

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Do you have an existing product line?</Label>
                    <RadioGroup
                        onValueChange={(value) => {
                            setFormData(prev => ({
                                ...prev,
                                basicDetails: {
                                    ...prev.basicDetails,
                                    hasExistingProduct: value,
                                    ...(value === "no" && { existingProductLink: "" })
                                }
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

                {formData.hasExistingProduct === "yes" && (
                    <div className="space-y-2">
                        <Label htmlFor="existingProductLink">Existing Product Link</Label>
                        <Input
                            id="existingProductLink"
                            name="existingProductLink"
                            type="url"
                            placeholder="https://"
                            value={formData.existingProductLink || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={getInputClassName('existingProductLink')}
                            required
                        />
                        {errors.existingProductLink && touched.existingProductLink &&
                            <p className="text-sm text-red-500">{errors.existingProductLink}</p>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasicDetailsForm;