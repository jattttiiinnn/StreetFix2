// "use client"

// import { useState, useRef } from 'react'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { motion } from 'framer-motion'
// import { Upload, MapPin, Camera, CheckCircle, Loader2, AlertCircle, Zap, FileImage } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Progress } from '@/components/ui/progress'

// export default function ReportPage() {
//   const supabase = createClientComponentClient();
//   const [dragActive, setDragActive] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [preview, setPreview] = useState<string>('')
//   const [category, setCategory] = useState('')
//   const [description, setDescription] = useState('')
//   const [location, setLocation] = useState('Auto-detecting location...')
//   const [analysisStarted, setAnalysisStarted] = useState(false)
//   const [analysisComplete, setAnalysisComplete] = useState(false)
//   const [confidence, setConfidence] = useState(0)
//   const [detectedIssue, setDetectedIssue] = useState('')
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitted, setSubmitted] = useState(false)
//   const [sessionData, setSessionData] = useState<any>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const categories = [
//     'Potholes',
//     'Garbage Dumps', 
//     'Stray Animals',
//     'Damaged Infrastructure',
//     'Open Manholes',
//     'Broken Street Lights',
//     'Other'
//   ]

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true)
//     } else if (e.type === 'dragleave') {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileUpload(e.dataTransfer.files[0])
//     }
//   }

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFileUpload(e.target.files[0])
//     }
//   }

//   const handleFileUpload = (file: File) => {
//     // Validate file type and size
//     const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
//     if (!validImageTypes.includes(file.type)) {
//       alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)')
//       return
//     }
    
//     // Check file size (limit to 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size exceeds 5MB limit. Please select a smaller image.')
//       return
//     }
    
//     setSelectedFile(file)
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       setPreview(e.target?.result as string)
//       startAIAnalysis()
//     }
//     reader.onerror = () => {
//       console.error('FileReader error:', reader.error)
//       alert('Error reading file. Please try another image.')
//     }
//     reader.readAsDataURL(file)
//   }

//   const startAIAnalysis = () => {
//     setAnalysisStarted(true)
//     setAnalysisComplete(false)
//     setConfidence(0)

//     const analysisSteps = [
//       { delay: 500, confidence: 25 },
//       { delay: 1000, confidence: 50 },
//       { delay: 1500, confidence: 75 },
//       { delay: 2000, confidence: 95 }
//     ]

//     analysisSteps.forEach((step, index) => {
//       setTimeout(() => {
//         setConfidence(step.confidence)
//         if (index === analysisSteps.length - 1) {
//           setAnalysisComplete(true)
//           setDetectedIssue('Pothole')
//           setCategory('Potholes')
//           setLocation('123 Main St, Downtown District')
//         }
//       }, step.delay)
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!selectedFile) {
//       alert('Please select an image')
//       return
//     }
    
//     if (!category || !description) {
//       alert('Please fill in all required fields')
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Get the current authenticated user reliably
//       const { data: { user } } = await supabase.auth.getUser();
//       setSessionData(user);
//       if (!user) {
//         throw new Error('You must be logged in to submit a report.');
//       }

//       const fileExt = selectedFile.name.split('.').pop() || 'jpg';
//       const timestamp = Date.now();
//       const fileName = `report-${timestamp}.${fileExt}`;

//       // Define publicUrl outside the try block so it's accessible for reportData
//       let publicUrl = '';

//       try {
//         // Validate file again before processing
//         if (!selectedFile) {
//           throw new Error('No file selected');
//         }

//         const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//         if (!validImageTypes.includes(selectedFile.type)) {
//           throw new Error('Invalid file type. Please select a valid image file.');
//         }

//         if (selectedFile.size > 5 * 1024 * 1024) {
//           throw new Error('File size exceeds 5MB limit.');
//         }

//         // Upload the file to the server using the API endpoint
//         const formData = new FormData();
//         formData.append('file', selectedFile);

//         const uploadResponse = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (!uploadResponse.ok) {
//           const errorData = await uploadResponse.json();
//           throw new Error(`Upload failed: ${errorData.error || uploadResponse.statusText}`);
//         }

//         const uploadResult = await uploadResponse.json();

//         // Use the public URL returned from the API
//         publicUrl = uploadResult.publicUrl;
//       } catch (error) {
//         console.error('Error processing file:', error);
//         throw new Error(error instanceof Error ? error.message : 'Failed to process the image file');
//       }
      

//       const reportData = {
//         title: detectedIssue || category,
//         description,
//         location: location || 'Location not specified',
//         status: 'pending',
//         reporter_id: user.id, // Always set to the current user's id
//         image_path: publicUrl,
//         category,
//         priority: 'medium',
//         confidence: confidence || 0
//       };

//       // Log the report data for debugging
//       console.log('Submitting report data:', reportData);

//       try {
//         const { data, error } = await supabase
//           .from('reports')
//           .insert([reportData])
//           .select();

//         if (error) {
//           // Error occurred during database insertion
//           console.error('Supabase insert error:', error);
//           throw new Error(`Database error: ${error.message || error.details || 'Unknown database error'}`);
//         }

//         if (!data || data.length === 0) {
//           throw new Error('Report was not saved properly');
//         }

//         console.log('Report submitted successfully:', data);
//       } catch (dbError) {
//         console.error('Database operation failed:', dbError);
//         throw dbError;
//       }

//       setSubmitted(true);
//     } catch (error) {
//       console.error('Submission error:', error);
//       // Provide more specific error messages based on the error type
//       let errorMessage = 'Unknown error';
//       if (error instanceof Error) {
//         errorMessage = error.message;
//         // Check for specific error patterns
//         if (errorMessage.includes('foreign key constraint')) {
//           errorMessage = 'Authentication required to submit reports';
//         } else if (errorMessage.includes('not found')) {
//           errorMessage = 'The reports table does not exist';
//         } else if (errorMessage.includes('permission denied')) {
//           errorMessage = 'You do not have permission to submit reports';
//         }
//       }
      
//       alert(`Error submitting report: ${errorMessage}`)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-muted/30 py-12">
//         <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
//             <Card className="shadow-xl">
//               <CardContent className="text-center p-8">
//                 <motion.div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
//                   <CheckCircle className="w-8 h-8 text-white" />
//                 </motion.div>
//                 <h2 className="text-2xl font-bold mb-4">Report Submitted Successfully!</h2>
//                 <p className="text-muted-foreground mb-6">
//                   Thank you for helping make our city better. Your report has been received and is being reviewed.
//                 </p>
//                 <Card className="bg-blue-50 dark:bg-blue-950 p-4 mb-6">
//                   <div className="space-y-2 text-sm">
//                     <p><strong>Report ID:</strong> UR-2024-{Math.floor(Math.random() * 10000)}</p>
//                     <p><strong>Estimated Response:</strong> 24-48 hours</p>
//                     {sessionData?.user && (
//                       <p><strong>Reward Tokens:</strong> +50 UT (pending verification)</p>
//                     )}
//                     {!sessionData?.user && (
//                       <p><strong>Note:</strong> Sign in to earn reward tokens for your reports</p>
//                     )}
//                   </div>
//                 </Card>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Button onClick={() => window.location.reload()}>Report Another Issue</Button>
//                   <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>View Dashboard</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-muted/30 py-12">
//       <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">Report an Issue</h1>
//           <p className="text-xl text-muted-foreground">Help us make your city better by reporting urban issues</p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileImage className="w-5 h-5" /> Upload Image
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div
//                   className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
//                     dragActive ? 'border-primary bg-primary/5' : selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-muted-foreground/25 hover:border-primary/50'
//                   }`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                 >
//                   <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  
//                   {preview ? (
//                     <div className="space-y-4">
//                       <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
//                       <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <motion.div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto" whileHover={{ scale: 1.1 }}>
//                         <Upload className="w-8 h-8 text-muted-foreground" />
//                       </motion.div>
//                       <div>
//                         <p className="font-medium">Drop your image here, or{' '}
//                           <button onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline">browse</button>
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {!preview && (
//                   <Button onClick={() => fileInputRef.current?.click()} className="w-full" size="lg">
//                     <Camera className="w-5 h-5 mr-2" /> Take Photo
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>

//             {/* {analysisStarted && (
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
//                 <Card className="shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="w-5 h-5 text-purple-500" /> AI Analysis
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span>Analysis Progress</span>
//                         <span>{confidence}%</span>
//                       </div>
//                       <Progress value={confidence} className="h-2" />
//                     </div>

//                     {analysisComplete && (
//                       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CheckCircle className="w-5 h-5 text-green-600" />
//                           <span className="font-semibold text-green-800 dark:text-green-200">
//                             Detected: {detectedIssue}
//                           </span>
//                         </div>
//                         <p className="text-sm text-green-700 dark:text-green-300">
//                           Confidence: {confidence}% - This appears to be a road pothole requiring immediate attention.
//                         </p>
//                       </motion.div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )} */}
//           </motion.div>

//           <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle>Report Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Issue Category</Label>
//                     <Select value={category} onValueChange={setCategory}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categories.map((cat) => (
//                           <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="location">Location</Label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                       <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" placeholder="Enter location" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description">Description</Label>
//                     <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide additional details about the issue..." rows={4} />
//                   </div>

//                   <Button type="submit" className="w-full" size="lg" disabled={!selectedFile || !category || isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Report...
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="w-4 h-4 mr-2" /> Submit Report
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             <Card className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
//               <CardContent className="p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-semibold text-blue-900 dark:text-blue-100">What happens next?</h4>
//                     <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
//                       <li>• Your report will be verified by our AI system</li>
//                       <li>• Local authorities will be notified within 24 hours</li>
//                       <li>• You'll earn reward tokens upon verification</li>
//                       <li>• Track progress in your dashboard</li>
//                     </ul>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Upload, MapPin, Camera, CheckCircle, Loader2, AlertCircle, Zap, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

export default function ReportPage() {
  const supabase = createClientComponentClient();
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('Auto-detecting location...')
  const [analysisStarted, setAnalysisStarted] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [detectedIssue, setDetectedIssue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    'Potholes',
    'Garbage Dumps', 
    'Stray Animals',
    'Damaged Infrastructure',
    'Open Manholes',
    'Broken Street Lights',
    'Other'
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Validate file type and size
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validImageTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)')
      return
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller image.')
      return
    }
    
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      startAIAnalysis()
    }
    reader.onerror = () => {
      console.error('FileReader error:', reader.error)
      alert('Error reading file. Please try another image.')
    }
    reader.readAsDataURL(file)
  }

  const startAIAnalysis = () => {
    setAnalysisStarted(true)
    setAnalysisComplete(false)
    setConfidence(0)

    const analysisSteps = [
      { delay: 500, confidence: 25 },
      { delay: 1000, confidence: 50 },
      { delay: 1500, confidence: 75 },
      { delay: 2000, confidence: 95 }
    ]

    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setConfidence(step.confidence)
        if (index === analysisSteps.length - 1) {
          setAnalysisComplete(true)
          setDetectedIssue('Pothole')
          setCategory('Potholes')
          setLocation('123 Main St, Downtown District')
        }
      }, step.delay)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select an image')
      return
    }
    
    if (!category || !description) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setAnalysisStarted(true)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("category", category)
    formData.append("description", description)
    formData.append("location", location)

    try {
      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to submit report")
      }

      const data = await res.json()

      // If topic is unrelated, reset the form
      if (!data.topic_related) {
        alert("Unrelated issue - please submit a report related to urban issues")
        // Reset form
        setSelectedFile(null)
        setPreview('')
        setCategory('')
        setDescription('')
        setLocation('Auto-detecting location...')
        setAnalysisStarted(false)
        setAnalysisComplete(false)
        setConfidence(0)
        setDetectedIssue('')
        setSubmitted(false)
        return
      }

      // If topic is related, proceed with submission
      setDetectedIssue(category)
      setConfidence(Math.floor((data.confidence || 0.95) * 100))

      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      setSessionData(user);
      if (!user) {
        throw new Error('You must be logged in to submit a report.');
      }

      const fileExt = selectedFile.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const fileName = `report-${timestamp}.${fileExt}`;

      // Define publicUrl
      let publicUrl = '';

      try {
        // Validate file again before processing
        if (!selectedFile) {
          throw new Error('No file selected');
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(selectedFile.type)) {
          throw new Error('Invalid file type. Please select a valid image file.');
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit.');
        }

        // Upload the file to the server using the API endpoint
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(`Upload failed: ${errorData.error || uploadResponse.statusText}`);
        }

        const uploadResult = await uploadResponse.json();
        publicUrl = uploadResult.publicUrl;
      } catch (error) {
        console.error('Error processing file:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to process the image file');
      }

      const reportData = {
        title: detectedIssue || category,
        description,
        location: location || 'Location not specified',
        status: 'pending',
        reporter_id: user.id,
        image_path: publicUrl,
        category,
        priority: 'medium',
        confidence: confidence || 0
      };

      console.log('Submitting report data:', reportData);

      try {
        const { data: insertData, error } = await supabase
          .from('reports')
          .insert([reportData])
          .select();

        if (error) {
          console.error('Supabase insert error:', error);
          throw new Error(`Database error: ${error.message || error.details || 'Unknown database error'}`);
        }

        if (!insertData || insertData.length === 0) {
          throw new Error('Report was not saved properly');
        }

        console.log('Report submitted successfully:', insertData);
        setSubmitted(true);
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        throw dbError;
      }
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes('foreign key constraint')) {
          errorMessage = 'Authentication required to submit reports';
        } else if (errorMessage.includes('not found')) {
          errorMessage = 'The reports table does not exist';
        } else if (errorMessage.includes('permission denied')) {
          errorMessage = 'You do not have permission to submit reports';
        }
      }
      
      alert(`Error submitting report: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-xl">
              <CardContent className="text-center p-8">
                <motion.div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-4">Report Submitted Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for helping make our city better. Your report has been received and is being reviewed.
                </p>
                <Card className="bg-blue-50 dark:bg-blue-950 p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <p><strong>Report ID:</strong> UR-2024-{Math.floor(Math.random() * 10000)}</p>
                    <p><strong>Estimated Response:</strong> 24-48 hours</p>
                    {sessionData?.user && (
                      <p><strong>Reward Tokens:</strong> +50 UT (pending verification)</p>
                    )}
                    {!sessionData?.user && (
                      <p><strong>Note:</strong> Sign in to earn reward tokens for your reports</p>
                    )}
                  </div>
                </Card>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.reload()}>Report Another Issue</Button>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>View Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Report an Issue</h1>
          <p className="text-xl text-muted-foreground">Help us make your city better by reporting urban issues</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" /> Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive ? 'border-primary bg-primary/5' : selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  
                  {preview ? (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto" whileHover={{ scale: 1.1 }}>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </motion.div>
                      <div>
                        <p className="font-medium">Drop your image here, or{' '}
                          <button onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline">browse</button>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {!preview && (
                  <Button onClick={() => fileInputRef.current?.click()} className="w-full" size="lg">
                    <Camera className="w-5 h-5 mr-2" /> Take Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {analysisStarted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-500" /> AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analysis Progress</span>
                        <span>{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-2" />
                    </div>

                    {analysisComplete && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            Detected: {detectedIssue}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Confidence: {confidence}% - This appears to be a road pothole requiring immediate attention.
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" placeholder="Enter location" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide additional details about the issue..." rows={4} />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={!selectedFile || !category || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Report...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" /> Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">What happens next?</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                      <li>• Your report will be verified by our AI system</li>
                      <li>• Local authorities will be notified within 24 hours</li>
                      <li>• You'll earn reward tokens upon verification</li>
                      <li>• Track progress in your dashboard</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}