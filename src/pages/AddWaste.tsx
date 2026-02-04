import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  X,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import VoiceButton from "@/components/ui/voice-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Image type with proper TypeScript support
interface ImageData {
  url: string;
  file: File;
  previewUrl: string;
  type: 'gallery' | 'camera';
  name: string;
  size: number;
}

// Enhanced upload error types
interface UploadError {
  type: 'permission' | 'file' | 'network' | 'processing' | 'validation';
  message: string;
  code?: string;
  retryable: boolean;
}

// Upload state with comprehensive error handling
interface UploadState {
  status: 'idle' | 'permission_pending' | 'permission_denied' | 'processing' | 'uploading' | 'success' | 'error' | 'timeout';
  message: string;
  progress: number;
  error: UploadError | null;
  retryCount: number;
  maxRetries: number;
  startTime: number | null;
  timeoutId: NodeJS.Timeout | null;
}

// Enhanced waste type detection with AI suggestions
const wasteTypeDetection = {
  "wheat-straw": { confidence: 85, detected: true, examples: "wheat stubble, golden straw, crop residue" },
  "rice-husk": { confidence: 82, detected: true, examples: "rice hulls, chaff, light brown particles" },
  "corn-stover": { confidence: 78, detected: true, examples: "corn stalks, leaves, green/brown stalk material" },
  "sugarcane-bagasse": { confidence: 90, detected: true, examples: "sugarcane fibers, pulp, pressed residue" },
  "cotton-stalks": { confidence: 75, detected: true, examples: "cotton stems, fibrous stalk material" },
  "other": { confidence: 60, detected: false, examples: "unknown waste, mixed agricultural residue" },
};

const wasteCategories = [
  { 
    id: "wheat-straw", 
    label: "Wheat Straw", 
    icon: "🌾", 
    examples: "Wheat stubble, straw",
    basePrice: 2.5,
    season: "Post-harvest"
  },
  { 
    id: "rice-husk", 
    label: "Rice Husk", 
    icon: "🌾", 
    examples: "Rice hulls, chaff",
    basePrice: 1.8,
    season: "Rice season"
  },
  { 
    id: "corn-stover", 
    label: "Corn Stover", 
    icon: "🌽", 
    examples: "Corn stalks, leaves",
    basePrice: 3.0,
    season: "Kharif season"
  },
  { 
    id: "sugarcane-bagasse", 
    label: "Sugarcane Bagasse", 
    icon: "🌱", 
    examples: "Crushed sugarcane residue",
    basePrice: 2.0,
    season: "Year-round"
  },
  { 
    id: "cotton-stalks", 
    label: "Cotton Stalks", 
    icon: "🌿", 
    examples: "Cotton plant residues",
    basePrice: 2.2,
    season: "Cotton harvest"
  },
  { 
    id: "other", 
    label: "Other Waste", 
    icon: "🍃", 
    examples: "Any other agricultural waste",
    basePrice: 1.5,
    season: "Various"
  },
];

// Pre-fill from home page navigation state
interface PreFilledState {
  category?: string;
}

const AddWaste = () => {
  const { createProduct, addNotification } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as PreFilledState;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    message: '',
    progress: 0,
    error: null,
    retryCount: 0,
    maxRetries: 3,
    startTime: null,
    timeoutId: null,
  });
  const [imageType, setImageType] = useState<'camera' | 'gallery'>('gallery');
  const [detectedCategory, setDetectedCategory] = useState(locationState?.category || "");
  const [autoDetectStats, setAutoDetectStats] = useState<Record<string, { confidence: number; detected: boolean; examples: string }> | undefined>();
  
  // State validation methods - same quantity validation values
  const [quantity, setQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [description, setDescription] = useState("");
  const [locationStateValue, setLocationStateValue] = useState("Village Rampur, District Varanasi, UP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [duplicateCheck, setDuplicateCheck] = useState(false);

  // Initialize with pre-filled category if provided
  useState(() => {
    try {
      if (locationState?.category) {
        setDetectedCategory(locationState.category);
      }
    } catch (error) {
      console.error('Error initializing pre-filled state:', error);
    }
  });

  // Enhanced image processing and upload with comprehensive error handling
  const handleImageUpload = async (type: 'camera' | 'gallery') => {
    setImageType(type);
    
    // Clear any previous errors
    setUploadState(prev => ({
      ...prev,
      error: null,
      retryCount: 0
    }));
    
    // Check permissions first
    if (type === 'camera') {
      try {
        setUploadState(prev => ({
          ...prev,
          status: 'permission_pending',
          message: 'Requesting camera access...',
          progress: 0
        }));
        
        // Set timeout for permission request
        const timeoutId = setTimeout(() => {
          setUploadState(prev => ({
            ...prev,
            status: 'timeout',
            message: 'Camera permission request timed out. Please try again.',
            error: {
              type: 'permission',
              message: 'Camera permission timeout',
              code: 'PERMISSION_TIMEOUT',
              retryable: true
            }
          }));
        }, 10000); // 10 second timeout
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Stop all tracks immediately to avoid keeping camera active
        stream.getTracks().forEach(track => track.stop());
        
        setUploadState(prev => ({
          ...prev,
          status: 'idle',
          message: '',
          progress: 0,
          timeoutId: null
        }));
      } catch (error) {
        console.error('Camera permission error:', error);
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Camera access denied. Please enable camera permissions in your browser settings.';
        
        setUploadState(prev => ({
          ...prev,
          status: 'permission_denied',
          message: errorMessage,
          error: {
            type: 'permission',
            message: errorMessage,
            code: 'PERMISSION_DENIED',
            retryable: true
          }
        }));
        return;
      }
    }

    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImageFile = async (file: File) => {
    // Validate file before processing
    if (!file) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        message: 'No file selected',
        error: {
          type: 'file',
          message: 'No file was selected for upload',
          code: 'NO_FILE_SELECTED',
          retryable: false
        }
      }));
      return;
    }
    
    setUploadState(prev => ({
      ...prev,
      status: 'processing',
      message: 'Processing image...',
      progress: 10,
      startTime: Date.now()
    }));
    
    try {
      // Set processing timeout
      const timeoutId = setTimeout(() => {
        setUploadState(prev => ({
          ...prev,
          status: 'timeout',
          message: 'Image processing timed out. Please try a smaller image.',
          error: {
            type: 'processing',
            message: 'Image processing timeout',
            code: 'PROCESSING_TIMEOUT',
            retryable: true
          }
        }));
      }, 15000); // 15 second timeout
      
      const reader = new FileReader();
      
      // Handle file read errors
      reader.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error('File read error:', error);
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          message: 'Failed to read image file',
          error: {
            type: 'file',
            message: 'Could not read the selected image file',
            code: 'FILE_READ_ERROR',
            retryable: true
          }
        }));
      };
      
      reader.onload = (e) => {
        clearTimeout(timeoutId);
        
        if (!e.target?.result) {
          setUploadState(prev => ({
            ...prev,
            status: 'error',
            message: 'Failed to load image data',
            error: {
              type: 'file',
              message: 'Image data could not be loaded',
              code: 'DATA_LOAD_ERROR',
              retryable: true
            }
          }));
          return;
        }
        
        setUploadState(prev => ({
          ...prev,
          progress: 30,
          message: 'Loading image...'
        }));
        
        const img = new Image();
        
        img.onerror = (error) => {
          console.error('Image load error:', error);
          setUploadState(prev => ({
            ...prev,
            status: 'error',
            message: 'Failed to load image',
            error: {
              type: 'file',
              message: 'The selected file is not a valid image',
              code: 'INVALID_IMAGE',
              retryable: true
            }
          }));
        };
        
        img.onload = () => {
          setUploadState(prev => ({
            ...prev,
            progress: 50,
            message: 'Analyzing image...'
          }));
          
          try {
            // Create canvas for image processing
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Set canvas dimensions
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0);
                
                // Simulate AI processing with progress updates
                let progress = 50;
                const interval = setInterval(() => {
                  progress += 5;
                  setUploadState(prev => ({
                    ...prev,
                    progress: Math.min(progress, 90),
                    message: progress < 80 ? 'Analyzing image...' : 'Finalizing results...'
                  }));
                }, 100);
                
                // Simulate AI processing delay
                setTimeout(() => {
                  clearInterval(interval);
                  
                  // Simulate AI detection results
                  const detectedTypes = Object.entries(wasteTypeDetection)
                    .map(([key, value]) => ({
                      type: key,
                      ...value,
                      confidence: Math.max(60, Math.min(95, value.confidence + (Math.random() * 10 - 5)))
                    }))
                    .sort((a, b) => b.confidence - a.confidence);
                  
                  setAutoDetectStats(Object.fromEntries(
                    detectedTypes.map(item => [item.type, item])
                  ));
                  
                  // Auto-select highest confidence category if not pre-filled
                  if (!locationState?.category && detectedTypes.length > 0) {
                    setDetectedCategory(detectedTypes[0].type);
                  }
                  
                  // Create image data
                  const imageData: ImageData = {
                    url: e.target.result as string,
                    file,
                    previewUrl: e.target.result as string,
                    type: imageType as 'gallery' | 'camera',
                    name: file.name,
                    size: file.size,
                  };
                  
                  setImages([imageData]);
                  setUploadState(prev => ({
                    ...prev,
                    status: 'success',
                    message: 'Image processed successfully!',
                    progress: 100
                  }));
                  
                  // Reset success state after delay
                  setTimeout(() => {
                    setUploadState(prev => ({
                      ...prev,
                      status: 'idle',
                      message: '',
                      progress: 0
                    }));
                  }, 2000);
                }, 2000);
              } else {
                throw new Error('Could not get canvas context');
              }
            } else {
              throw new Error('Canvas element not available');
            }
          } catch (error) {
            console.error('Image processing error:', error);
            setUploadState(prev => ({
              ...prev,
              status: 'error',
              message: 'Failed to process image',
              error: {
                type: 'processing',
                message: error instanceof Error ? error.message : 'Unknown processing error',
                code: 'PROCESSING_ERROR',
                retryable: true
              }
            }));
          }
        };
        
        img.src = e.target.result as string;
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Process image error:', error);
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        message: 'Failed to process image',
        error: {
          type: 'processing',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNEXPECTED_ERROR',
          retryable: true
        }
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Clear any previous errors
    setUploadState(prev => ({
      ...prev,
      error: null
    }));
    
    if (!file) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        message: 'No file selected',
        error: {
          type: 'file',
          message: 'Please select an image file to upload',
          code: 'NO_FILE_SELECTED',
          retryable: false
        }
      }));
      return;
    }
    
    try {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        const supportedTypes = validTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          message: `Invalid file type. Please select ${supportedTypes} images only`,
          error: {
            type: 'file',
            message: `Unsupported file type: ${file.type}. Supported types: ${supportedTypes}`,
            code: 'INVALID_FILE_TYPE',
            retryable: false
          }
        }));
        return;
      }
      
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          message: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size: ${maxSizeMB}MB`,
          error: {
            type: 'file',
            message: `File size ${file.size} bytes exceeds maximum ${maxSize} bytes`,
            code: 'FILE_TOO_LARGE',
            retryable: false
          }
        }));
        return;
      }
      
      if (file.size < 1024) { // Less than 1KB
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          message: 'File too small. Please select a valid image file',
          error: {
            type: 'file',
            message: 'File appears to be corrupted or invalid',
            code: 'FILE_TOO_SMALL',
            retryable: true
          }
        }));
        return;
      }
      
      // All validations passed, process the file
      processImageFile(file);
      
    } catch (error) {
      console.error('File validation error:', error);
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        message: 'Failed to validate file',
        error: {
          type: 'validation',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          code: 'VALIDATION_ERROR',
          retryable: true
        }
      }));
    } finally {
      // Reset input to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    try {
      // Clear any upload state when removing image
      setUploadState(prev => ({
        ...prev,
        status: 'idle',
        message: '',
        error: null,
        progress: 0
      }));
      
      setImages(prev => prev.filter((_, i) => i !== index));
      setAutoDetectStats(undefined);
      
      if (!locationState?.category) {
        setDetectedCategory("");
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // Even if there's an error, try to clear the state
      setImages([]);
      setAutoDetectStats(undefined);
      setDetectedCategory("");
    }
  };

  const retryUpload = () => {
    // Clear error state and increment retry count
    setUploadState(prev => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1,
      status: 'idle',
      message: '',
      progress: 0
    }));
    
    // Check if we've exceeded max retries
    if (uploadState.retryCount >= uploadState.maxRetries) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        message: 'Maximum retry attempts exceeded. Please try again later.',
        error: {
          type: 'network',
          message: 'Maximum retry attempts exceeded',
          code: 'MAX_RETRIES_EXCEEDED',
          retryable: false
        }
      }));
      return;
    }
    
    // Trigger file input again
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Cancel upload and reset state
  const cancelUpload = () => {
    setUploadState(prev => ({
      ...prev,
      status: 'idle',
      message: '',
      error: null,
      progress: 0,
      retryCount: 0
    }));
    
    // Clear any timeout
    if (uploadState.timeoutId) {
      clearTimeout(uploadState.timeoutId);
    }
    
    // Clear images if any
    setImages([]);
    setAutoDetectStats(undefined);
    if (!locationState?.category) {
      setDetectedCategory("");
    }
  };

  // Enhanced AI price prediction with market analysis
  const handleGetPrice = () => {
    if (!detectedCategory) return null;
    
    const category = wasteCategories.find(c => c.id === detectedCategory);
    if (!category) return null;
    
    // Enhanced price prediction with market factors
    const basePrice = category.basePrice;
    const seasonalMultiplier = category.season === "Year-round" ? 1.0 : 
                             category.season === "Post-harvest" ? 1.15 :
                             category.season === "Rice season" ? 1.05 : 1.0;
    
    const quantityMultiplier = parseInt(quantity) > 10 ? 0.95 : 1.0; // Bulk discount
    const qualityMultiplier = description.toLowerCase().includes('fresh') ? 1.1 : 
                             description.toLowerCase().includes('dry') ? 1.05 : 1.0;
    
    const predictedPrice = {
      min: parseFloat((basePrice * 0.85 * seasonalMultiplier * quantityMultiplier).toFixed(2)),
      max: parseFloat((basePrice * 1.25 * seasonalMultiplier * qualityMultiplier).toFixed(2)),
      recommended: parseFloat((basePrice * seasonalMultiplier * quantityMultiplier * qualityMultiplier).toFixed(2)),
      trend: Math.random() > 0.5 ? "+5%" : "-2%",
      confidence: 85 + Math.floor(Math.random() * 10),
      factors: {
        seasonal: seasonalMultiplier > 1 ? "High season demand" : "Normal demand",
        bulk: quantityMultiplier < 1 ? "Bulk quantity discount" : "Standard pricing",
        quality: qualityMultiplier > 1 ? "High quality premium" : "Standard quality"
      }
    };
    
    setPricePerKg(predictedPrice.recommended.toString());
    return predictedPrice;
  };

  // Enhanced form validation with comprehensive checks and logging
  const validateStep = (stepNumber: number) => {
    try {
      switch (stepNumber) {
        case 1: // Image upload
          // Must have at least one image and no active upload errors
          const hasImage = images.length > 0;
          const noUploadErrors = uploadState.status !== 'error' && 
                               uploadState.status !== 'permission_denied' &&
                               uploadState.status !== 'timeout';
          
          if (!hasImage) {
            console.warn('Validation failed: No image uploaded');
          }
          if (!noUploadErrors) {
            console.warn('Validation failed: Active upload errors present');
          }
          
          return hasImage && noUploadErrors;
                  
        case 2: // Waste type
          const hasCategory = !!detectedCategory && detectedCategory.trim() !== '';
          if (!hasCategory) {
            console.warn('Validation failed: No waste category selected');
          }
          return hasCategory;
          
        case 3: // Details
          const hasQuantity = quantity && !isNaN(parseFloat(quantity)) && parseFloat(quantity) > 0;
          const hasPrice = pricePerKg && !isNaN(parseFloat(pricePerKg)) && parseFloat(pricePerKg) > 0;
          const hasDescription = description && description.trim() !== '';
          const hasLocation = locationStateValue && locationStateValue.trim() !== '';
          
          if (!hasQuantity) console.warn('Validation failed: Invalid quantity');
          if (!hasPrice) console.warn('Validation failed: Invalid price');
          if (!hasDescription) console.warn('Validation failed: No description');
          if (!hasLocation) console.warn('Validation failed: No location');
          
          return hasQuantity && hasPrice && hasDescription && hasLocation;
                  
        case 4: // Review
          // All previous steps must be valid
          const step1Valid = validateStep(1);
          const step2Valid = validateStep(2);
          const step3Valid = validateStep(3);
          
          if (!step1Valid || !step2Valid || !step3Valid) {
            console.warn('Review validation failed:', { step1Valid, step2Valid, step3Valid });
          }
          
          return step1Valid && step2Valid && step3Valid;
          
        default:
          console.warn('Validation failed: Invalid step number', stepNumber);
          return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  // Duplicate submission prevention
  const checkDuplicateSubmission = async () => {
    if (duplicateCheck) return true;
    
    // Simulate duplicate check
    const isDuplicate = Math.random() < 0.05; // 5% chance of duplicate
    if (isDuplicate) {
      setSubmissionError("Similar listing already exists. Please check your existing listings.");
      return true;
    }
    
    setDuplicateCheck(true);
    return false;
  };

  // Enhanced submission with comprehensive error handling and logging
  const handleSubmitListing = async () => {
    try {
      console.log('Starting listing submission process');
      
      // Validate user authentication
      if (!user) {
        const errorMessage = "You must be logged in to create a listing";
        console.error('Submission error: Authentication failed', { user: user?.uid || 'null' });
        setSubmissionError(errorMessage);
        addNotification({
          title: 'Authentication Required',
          message: errorMessage,
          type: 'error'
        });
        return;
      }
      
      // Validate all steps
      if (!validateStep(4)) {
        const errorMessage = "Please complete all required fields correctly";
        console.error('Validation error: Form validation failed', {
          step1: validateStep(1),
          step2: validateStep(2),
          step3: validateStep(3),
          images: images.length,
          category: detectedCategory,
          quantity: quantity,
          price: pricePerKg
        });
        setSubmissionError(errorMessage);
        addNotification({
          title: 'Validation Error',
          message: errorMessage,
          type: 'error'
        });
        return;
      }
      
      // Check for duplicates
      if (await checkDuplicateSubmission()) {
        console.warn('Submission cancelled: Duplicate listing detected');
        return;
      }
      
      setIsSubmitting(true);
      setSubmissionError(null);
      
      console.log('Starting network request with retry logic');
      
      // Simulate network request with comprehensive retry logic
      const maxRetries = 3;
      let success = false;
      let lastError: any = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Submission attempt ${attempt}/${maxRetries}`);
          
          // Show progress for submission
          addNotification({
            title: 'Publishing Listing',
            message: `Attempt ${attempt} of ${maxRetries}...`,
            type: 'info'
          });
          
          // Simulate API call delay with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => {
              console.error('Request timeout reached');
              reject(new Error('Request timeout - please check your network connection'));
            }, 15000)
          );
          
          const apiCallPromise = new Promise(async (resolve, reject) => {
            try {
              // Simulate network delay
              await new Promise(resolveDelay => setTimeout(resolveDelay, 2000 + Math.random() * 2000));
              
              // 85% success rate per attempt (more realistic)
              if (Math.random() > 0.15) {
                const productData = {
                  name: wasteCategories.find(c => c.id === detectedCategory)?.label || "Agricultural Waste",
                  category: detectedCategory as any,
                  quantity: parseInt(quantity) * 100, // Convert quintals to kg
                  pricePerKg: parseFloat(pricePerKg),
                  unit: 'kg' as const,
                  location: locationStateValue,
                  description,
                  available: true,
                  images: images.map(img => img.previewUrl || img.url), // Store image URLs
                };
                
                console.log('Creating product with data:', {
                  name: productData.name,
                  category: productData.category,
                  quantity: productData.quantity,
                  price: productData.pricePerKg
                });
                
                const result = await createProduct(productData);
                console.log('Product created successfully:', result.id);
                resolve(result);
              } else {
                const error = new Error(`Network error on attempt ${attempt}. Please check your connection and try again.`);
                console.error('Network error occurred:', error.message);
                reject(error);
              }
            } catch (innerError) {
              console.error('API call error:', innerError);
              reject(innerError);
            }
          });
          
          // Race between API call and timeout
          await Promise.race([apiCallPromise, timeoutPromise]);
          success = true;
          break;
          
        } catch (err) {
          lastError = err;
          console.error(`Submission attempt ${attempt} failed:`, err);
          
          if (attempt < maxRetries) {
            // Wait before retry with exponential backoff
            const delay = 1000 * Math.pow(2, attempt - 1) + Math.random() * 1000;
            console.log(`Retrying in ${delay}ms`);
            
            addNotification({
              title: 'Retrying Submission',
              message: `Attempt ${attempt} failed. Retrying in ${(delay/1000).toFixed(1)} seconds...`,
              type: 'warning'
            });
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (success) {
        console.log('Listing submission successful');
        
        // Add success notification
        addNotification({
          title: 'Listing Created Successfully',
          message: `Your ${wasteCategories.find(c => c.id === detectedCategory)?.label} listing has been published to the marketplace`,
          type: 'success'
        });
        
        // Reset form and navigate
        resetForm();
        navigate("/home");
      } else {
        const errorMessage = lastError instanceof Error 
          ? lastError.message 
          : "Failed to create listing after multiple attempts. Please try again later.";
        
        console.error("Final submission error:", errorMessage, lastError);
        setSubmissionError(errorMessage);
        addNotification({
          title: 'Submission Failed',
          message: errorMessage,
          type: 'error'
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred. Please try again.";
      
      console.error("Unexpected submission error:", error);
      setSubmissionError(errorMessage);
      addNotification({
        title: 'Error',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
      console.log('Submission process completed');
    }
  };

  const resetForm = () => {
    try {
      setStep(1);
      setImages([]);
      setDetectedCategory(locationState?.category || "");
      setQuantity("");
      setPricePerKg("");
      setDescription("");
      setLocationStateValue("Village Rampur, District Varanasi, UP");
      setDuplicateCheck(false);
      setAutoDetectStats(undefined);
      setSubmissionError(null);
      setRetryCount(0);
      
      // Reset upload state
      setUploadState({
        status: 'idle',
        message: '',
        progress: 0,
        error: null,
        retryCount: 0,
        maxRetries: 3,
        startTime: null,
        timeoutId: null,
      });
      
      // Clear any timeouts
      if (uploadState.timeoutId) {
        clearTimeout(uploadState.timeoutId);
      }
    } catch (error) {
      console.error('Error resetting form:', error);
      // Even if reset fails, try to clear critical state
      setStep(1);
      setImages([]);
      setSubmissionError(null);
    }
  };

  // Calculate predicted price for display
  const predictedPrice = handleGetPrice();

  return (
    <MobileLayout>
      <AppHeader title="Add Waste" />
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={imageType === 'camera' ? 'environment' : undefined}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="px-4 py-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step >= s
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all",
                    step > s ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Photo Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Upload Photo</h2>
                <p className="text-muted-foreground text-sm">
                  Take a clear photo of your agricultural waste
                </p>
              </div>

              {/* Enhanced Upload State Messages with Progress */}
              {uploadState.status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-xl",
                    uploadState.status === 'error' || 
                    uploadState.status === 'permission_denied' ||
                    uploadState.status === 'timeout'
                      ? "bg-destructive/10 border border-destructive/30"
                      : uploadState.status === 'success'
                      ? "bg-success/10 border border-success/30"
                      : "bg-muted/50 border border-border"
                  )}
                >
                  {/* Progress Bar */}
                  {(uploadState.status === 'processing' || uploadState.status === 'uploading') && uploadState.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Processing image...</span>
                        <span>{uploadState.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadState.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2">
                    {uploadState.status === 'processing' && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    )}
                    {uploadState.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    )}
                    {uploadState.status === 'permission_pending' && (
                      <Loader2 className="w-5 h-5 animate-spin text-warning" />
                    )}
                    {uploadState.status === 'permission_denied' && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {uploadState.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {uploadState.status === 'timeout' && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {uploadState.status === 'success' && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      uploadState.status === 'error' || 
                      uploadState.status === 'permission_denied' ||
                      uploadState.status === 'timeout'
                        ? "text-destructive"
                        : uploadState.status === 'success'
                        ? "text-success"
                        : "text-muted-foreground"
                    )}>
                      {uploadState.message}
                    </span>
                  </div>
                  
                  {/* Enhanced Error Actions */}
                  {(uploadState.status === 'error' || 
                    uploadState.status === 'permission_denied' ||
                    uploadState.status === 'timeout') && (
                    <div className="flex gap-2 mt-3 justify-center">
                      {uploadState.error?.retryable && uploadState.retryCount < uploadState.maxRetries && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={retryUpload}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Try Again
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelUpload}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {/* Error Details */}
                  {uploadState.error && (
                    <div className="mt-2 text-xs text-muted-foreground text-center">
                      <p>Error Code: {uploadState.error.code}</p>
                      {uploadState.retryCount > 0 && (
                        <p>Retry attempts: {uploadState.retryCount}/{uploadState.maxRetries}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Image Preview with Safety Checks */}
              {images.length > 0 && images[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden border-2 border-success">
                    <img
                      src={images[0].previewUrl || images[0].url}
                      alt="Uploaded waste"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        // Fallback to a placeholder or error state
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  <button
                    onClick={() => removeImage(0)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-success">
                      {imageType === 'camera' ? '📸 Camera Photo' : '🖼️ Gallery Image'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {images[0].name || 'Unnamed image'} • 
                      {images[0].size ? (images[0].size / 1024 / 1024).toFixed(2) : '0.00'} MB
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Upload Options with Safety Checks */}
              {images.length === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed"
                    onClick={() => {
                      try {
                        handleImageUpload('gallery');
                      } catch (error) {
                        console.error('Gallery upload error:', error);
                        setUploadState(prev => ({
                          ...prev,
                          status: 'error',
                          message: 'Failed to open gallery',
                          error: {
                            type: 'file',
                            message: 'Could not access gallery',
                            code: 'GALLERY_ACCESS_ERROR',
                            retryable: true
                          }
                        }));
                      }
                    }}
                    disabled={uploadState.status === 'processing' || 
                             uploadState.status === 'uploading' ||
                             uploadState.status === 'permission_pending' ||
                             !!uploadState.error}
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <span className="font-medium">Gallery</span>
                    <span className="text-xs text-muted-foreground">Choose existing</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed"
                    onClick={() => {
                      try {
                        handleImageUpload('camera');
                      } catch (error) {
                        console.error('Camera upload error:', error);
                        setUploadState(prev => ({
                          ...prev,
                          status: 'error',
                          message: 'Failed to access camera',
                          error: {
                            type: 'permission',
                            message: 'Could not access camera',
                            code: 'CAMERA_ACCESS_ERROR',
                            retryable: true
                          }
                        }));
                      }
                    }}
                    disabled={uploadState.status === 'processing' || 
                             uploadState.status === 'uploading' ||
                             uploadState.status === 'permission_pending' ||
                             !!uploadState.error}
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="font-medium">Camera</span>
                    <span className="text-xs text-muted-foreground">Take new photo</span>
                  </Button>
                </div>
              )}

              {/* AI Detection Results with Safety Checks */}
              {autoDetectStats && images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Analysis Results
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(autoDetectStats)
                      .filter(([type]) => type && wasteCategories.find(c => c.id === type))
                      .slice(0, 3)
                      .map(([type, stats]) => {
                        const category = wasteCategories.find(c => c.id === type);
                        if (!category || !stats) return null;
                        
                        return (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {category.label}
                            </span>
                            <span className={cn(
                              "font-medium",
                              stats.confidence > 80 ? "text-success" : 
                              stats.confidence > 60 ? "text-warning" : "text-muted-foreground"
                            )}>
                              {Math.max(0, Math.min(100, stats.confidence || 0)).toFixed(0)}% confidence
                            </span>
                          </div>
                        );
                      })
                    }
                  </div>
                  {Object.keys(autoDetectStats).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No detection results available
                    </p>
                  )}
                </motion.div>
              )}

              <Button
                size="lg"
                className="w-full rounded-xl h-14 bg-gradient-primary"
                onClick={() => {
                  // Validate before navigation
                  if (!validateStep(1)) {
                    setUploadState(prev => ({
                      ...prev,
                      status: 'error',
                      message: 'Please upload a valid image before continuing',
                      error: {
                        type: 'validation',
                        message: 'No valid image uploaded',
                        code: 'NO_IMAGE_UPLOADED',
                        retryable: false
                      }
                    }));
                    return;
                  }
                  
                  // Check if there are any active errors
                  if (uploadState.error) {
                    setUploadState(prev => ({
                      ...prev,
                      status: 'error',
                      message: 'Please resolve the error before continuing'
                    }));
                    return;
                  }
                  
                  setStep(2);
                }}
                disabled={!validateStep(1) || 
                         uploadState.status === 'processing' || 
                         uploadState.status === 'uploading' ||
                         uploadState.status === 'permission_pending' ||
                         !!uploadState.error}
              >
                {uploadState.status === 'processing' || uploadState.status === 'uploading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {uploadState.status === 'processing' ? 'Processing...' : 'Uploading...' }
                  </>
                ) : uploadState.status === 'permission_pending' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Requesting Permission...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Step 2: Waste Type Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Waste Type</h2>
                <p className="text-muted-foreground text-sm">
                  {detectedCategory 
                    ? "Confirm or select the correct waste type" 
                    : "Select the type of agricultural waste"
                  }
                </p>
              </div>

              {/* Auto-detected suggestion */}
              {detectedCategory && autoDetectStats?.[detectedCategory] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-primary">
                      AI Suggested: {wasteCategories.find(c => c.id === detectedCategory)?.label}
                    </span>
                    <span className="text-sm text-primary/80">
                      ({autoDetectStats[detectedCategory].confidence}% confidence)
                    </span>
                  </div>
                  <p className="text-sm text-primary/80">
                    {autoDetectStats[detectedCategory].examples}
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {wasteCategories.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDetectedCategory(type.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all relative",
                      detectedCategory === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    {detectedCategory === type.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h4 className="font-bold text-foreground">{type.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type.examples}
                    </p>
                    <div className="mt-2 text-xs font-medium text-primary">
                      ₹{type.basePrice}/kg base
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {type.season}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-primary"
                  onClick={() => setStep(3)}
                  disabled={!validateStep(2)}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quantity & Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Details</h2>
                <p className="text-muted-foreground text-sm">
                  Enter quantity and confirm details
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Quantity (in quintals)
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex-1 h-14 rounded-xl text-lg"
                      min="1"
                    />
                    <VoiceButton
                      onVoiceInput={(text) => setQuantity(text.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price per kg (₹)
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="number"
                      placeholder="Enter price per kg"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value)}
                      className="flex-1 h-14 rounded-xl text-lg"
                      min="0.1"
                      step="0.1"
                    />
                    <VoiceButton
                      onVoiceInput={(text) => setPricePerKg(text.replace(/[^0-9.]/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="Describe your waste (quality, condition, etc.)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-14 rounded-xl text-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup Location
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 rounded-xl border border-border bg-card flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Auto-detected</p>
                      <p className="text-sm text-muted-foreground">
                        {locationStateValue}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-success" />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-primary"
                  onClick={() => {
                    setStep(4);
                    handleGetPrice();
                  }}
                  disabled={!validateStep(3)}
                >
                  Get AI Price
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Price Prediction & Review */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">AI Price Suggestion</h2>
                <p className="text-muted-foreground text-sm">
                  Based on market analysis & demand
                </p>
              </div>

              {predictedPrice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-primary rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-primary-foreground/80 text-sm mb-2">
                    Recommended Price
                  </p>
                  <p className="text-4xl font-bold text-primary-foreground mb-2">
                    ₹{predictedPrice.recommended}
                    <span className="text-lg font-normal opacity-80">/kg</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="opacity-80">Market range:</span>
                    <span className="font-semibold">
                      ₹{predictedPrice.min} - ₹{predictedPrice.max}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <span className="text-success font-semibold">{predictedPrice.trend}</span>
                    <span className="opacity-80">vs last week</span>
                  </div>
                  <div className="mt-2 text-xs opacity-80">
                    Confidence: {predictedPrice.confidence}%
                  </div>
                </motion.div>
              )}

              {/* Price Factors */}
              {predictedPrice?.factors && (
                <div className="bg-card rounded-xl p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Pricing Factors</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seasonal Demand:</span>
                      <span className="text-foreground">{predictedPrice.factors.seasonal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity Discount:</span>
                      <span className="text-foreground">{predictedPrice.factors.bulk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality Premium:</span>
                      <span className="text-foreground">{predictedPrice.factors.quality}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Listing Summary */}
              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                <h4 className="font-semibold text-foreground">Listing Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Waste Type</span>
                  <span className="font-medium">
                    {wasteCategories.find((t) => t.id === detectedCategory)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantity} quintals ({parseInt(quantity) * 100} kg)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price/kg</span>
                  <span className="font-medium">₹{pricePerKg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Total Value</span>
                  <span className="font-bold text-primary">
                    ₹{(parseInt(quantity) * 100 * parseFloat(pricePerKg || "0")).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{locationStateValue}</span>
                </div>
              </div>

              {/* Error Display */}
              {submissionError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-center">
                  <p className="text-sm text-destructive">{submissionError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(3)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-success"
                  onClick={handleSubmitListing}
                  disabled={isSubmitting || !validateStep(4)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Publish Listing
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default AddWaste;