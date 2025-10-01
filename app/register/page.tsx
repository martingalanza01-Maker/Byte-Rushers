"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    civilStatus: "",
    
    // Address Information
    houseNumber: "",
    street: "",
    purok: "",
    barangayHall: "",
    
    // Account Information
    password: "",
    confirmPassword: "",
    
    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
  })
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const validateEmailAvailability = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/residents/exists?email=${encodeURIComponent(email)}`)
      if (!res.ok) return {exists: false}
      const data = await res.json()
      return {exists: !!data.exists}
    } catch {
      return {exists: false}
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateStep3()) {
      setError('Please complete all required fields and accept the terms')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || '',
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        houseNumber: formData.houseNumber,
        street: formData.street,
        purok: formData.purok,
        barangayHall: formData.barangayHall,
        password: formData.password
      }
      const res = await fetch(`${API_BASE}/residents`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:'Registration failed'}))
        setError(err?.error?.message || err?.message || 'Registration failed')
        return
      }
      setStep(4) // success step
    } catch (err:any) {
      setError('Network error while creating account')
    } finally {
      setIsLoading(false)
    }
  }


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'civilStatus']
    return required.every(field => formData[field as keyof typeof formData])
  }

  const validateStep2 = () => {
    const required = ['houseNumber', 'street', 'purok', 'barangayHall']
    return required.every(field => formData[field as keyof typeof formData])
  }

  const validateStep3 = () => {
    return formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 8 &&
           formData.termsAccepted &&
           formData.privacyAccepted
  }

  const handleNext = async () => {
    setError("")
    
    if (step === 1 && !validateStep1()) {
      setError("Please fill in all required fields")
      return
    }
    // Email availability check on Step 1
    if (step === 1) {
      const {exists} = await validateEmailAvailability(formData.email)
      if (exists) {
        setError('This email is already registered')
        return
      }
    }
    
    if (step === 2 && !validateStep2()) {
      setError("Please fill in all address fields")
      return
    }
    
    if (step < 3) {
      setStep(step + 1)
    }
  }

  

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Register for barangay services access</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <CardTitle>Registration</CardTitle>
                <CardDescription>Step {step} of 4</CardDescription>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="09XX-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="civilStatus">Civil Status *</Label>
                      <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange('civilStatus', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="houseNumber">House Number *</Label>
                      <Input
                        id="houseNumber"
                        value={formData.houseNumber}
                        onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="street">Street *</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purok">Purok/Zone *</Label>
                      <Select value={formData.purok} onValueChange={(value) => handleInputChange('purok', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purok" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purok-1">Purok 1</SelectItem>
                          <SelectItem value="purok-2">Purok 2</SelectItem>
                          <SelectItem value="purok-3">Purok 3</SelectItem>
                          <SelectItem value="purok-4">Purok 4</SelectItem>
                          <SelectItem value="purok-5">Purok 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="barangayHall">Preferred Barangay Hall *</Label>
                      <Select value={formData.barangayHall} onValueChange={(value) => handleInputChange('barangayHall', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hall" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="napico">Napico Hall</SelectItem>
                          <SelectItem value="greenpark">Greenpark Hall</SelectItem>
                          <SelectItem value="karangalan">Karangalan Hall</SelectItem>
                          <SelectItem value="manggahan-proper">Manggahan Proper Hall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Address Verification</h4>
                    <p className="text-sm text-blue-800">
                      Your address will be verified during your first document request. Please ensure all information is accurate.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Account Security */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded ${
                                level <= passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too weak"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className={`h-3 w-3 ${formData.password.length >= 8 ? "text-green-500" : "text-gray-400"}`} />
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(formData.password) ? "text-green-500" : "text-gray-400"}`} />
                        <span>One uppercase letter</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className={`h-3 w-3 ${/[a-z]/.test(formData.password) ? "text-green-500" : "text-gray-400"}`} />
                        <span>One lowercase letter</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(formData.password) ? "text-green-500" : "text-gray-400"}`} />
                        <span>One number</span>
                      </li>
                    </ul>
                  </div>

                  {/* Terms and Privacy */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                      />
                      <div className="text-sm">
                        <label htmlFor="terms" className="cursor-pointer">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked as boolean)}
                      />
                      <div className="text-sm">
                        <label htmlFor="privacy" className="cursor-pointer">
                          I consent to the collection and processing of my personal data for barangay services
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Registration Successful!</h3>
                  <p className="text-gray-600">
                    Your account has been created successfully. You can now log in and access barangay services.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      A verification email has been sent to <strong>{formData.email}</strong>. 
                      Please verify your email address to activate all features.
                    </p>
                  </div>
                  <Link href="/">
                    <Button className="w-full">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 4 && (
                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {step < 3 ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading || !validateStep3()}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
