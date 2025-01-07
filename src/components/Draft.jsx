import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';

const PDFForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        emailjs.init("F-yuhLre4fD-EYstB");
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Form Submission', 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${formData.name}`, 20, 40);
        doc.text(`Email: ${formData.email}`, 20, 50);
        doc.text(`Message: ${formData.message}`, 20, 60);

        // Get the PDF as base64
        return doc.output('datauristring').split(',')[1]; // This extracts only the base64 part
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');

        try {
            // Generate PDF and get base64 string
            const base64PDF = generatePDF();

            // Send email with the PDF as an attachment
            const emailResponse = await emailjs.send(
                "service_dqge20c",
                "template_2nur75l",
                {
                    to_email: "juangaljoen@gmail.com",
                    from_name: formData.name,
                    user_email: formData.email,
                    message: formData.message,
                    pdf_attachment: base64PDF,
                    attachment_name: `Quote-${formData.name}.pdf`, // Optional: Name for the file
                }
            );

            if (emailResponse.status !== 200) {
                throw new Error('Failed to send email');
            }

            setStatus('Form submitted successfully! PDF has been emailed.');

            // Clear form
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            console.error('Submission error:', error);
            setStatus(`Error: ${error.message}. Please try again or contact support.`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Form to PDF</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full min-h-24 px-3 py-2 border rounded-md"
                            placeholder="Enter your message"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Submit and Download PDF'}
                    </Button>

                    {status && (
                        <Alert>
                            <AlertDescription>{status}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default PDFForm;