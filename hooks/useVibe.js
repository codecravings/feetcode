'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const VibeContext = createContext()

export function VibeProvider({ children }) {
  const [vibe, setVibe] = useState('professional')

  useEffect(() => {
    const savedVibe = localStorage.getItem('feetcode_vibe')
    if (savedVibe && ['professional', 'humorous', 'genz'].includes(savedVibe)) {
      setVibe(savedVibe)
    }
  }, [])
   85 +      return _parseResponse(response.data);                                                                                                                                                                               
       86 +    } on DioException catch (e) {                                                                                                                                                                                         
       87 +      final statusCode = e.response?.statusCode;                                                                                                                                                                          
       88 +                                                                                                                                                                                                                          
       89 +      if (e.type == DioExceptionType.connectionTimeout ||                                                                                                                                                                 
       90 +          e.type == DioExceptionType.receiveTimeout) {                                                                                                                                                                    
       91 +        if (retriesLeft > 0) {                                                                                                                                                                                            
       92 +          await Future.delayed(const Duration(seconds: 2));                                                                                                                                                               
       93 +          return _analyzeTextWithRetry(description, retriesLeft: retriesLeft - 1);                                                                                                                                        
       94 +        }                                                                                                                                                                                                                 
       95 +        return Result.failure(                                                                                                                                                                                            
       96 +          const NetworkFailure(message: 'Request timed out. Check your connection and try again.'),                                                                                                                       
       97 +        );                                                                                                                                                                                                                
       98 +      }                                                                                                                                                                                                                   
       99 +                                                                                                                                                                                                                          
      100 +      if (statusCode == 401) {                                                                                                                                                                                            
      101 +        return Result.failure(                                                                                                                                                                                            
      102 +          const AIServiceFailure(message: 'Invalid OpenAI API key. Check your .env file.'),                                                                                                                               
      103 +        );                                                                                                                                                                                                                
      104 +      }   
       105 +                                                                                                                                                                                                                          
      106 +      if (statusCode == 429 && retriesLeft > 0) {                                                                                                                                                                         
      107 +        await Future.delayed(const Duration(seconds: 3));                                                                                                                                                                 
      108 +        return _analyzeTextWithRetry(description, retriesLeft: retriesLeft - 1);                                                                                                                                          
      109 +      }                                                                                                                                                                                                                   
      110 +                                                                                                                                                                                                                          
      111 +      if (statusCode == 429) {                                                                                                                                                                                            
      112 +        return Result.failure(                                                                                                                                                                                            
      113 +          AIServiceFailure(message: 'Rate limited on ${_model.displayName}. Try switching to a Gemini model.'),                                                                                                           
      114 +        );                                                                                                                                                                                                                
      115 +      }   
  const updateVibe = (newVibe) => {
    setVibe(newVibe)
    localStorage.setItem('feetcode_vibe', newVibe)
  }

  const contextValue = {
    vibe,
    setVibe: updateVibe
  }

  return (
    <VibeContext.Provider value={contextValue}>
      {children}
    </VibeContext.Provider>
  )
}

export function useVibe() {
  const context = useContext(VibeContext)
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider')
  }
  return context
}

export const VIBES = ['professional', 'humorous', 'genz']
