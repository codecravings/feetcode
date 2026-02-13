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
      406 +                      const SizedBox(height: 12),                                                                                                                                                           
      407 +                                                                                                                                                                                                            
      408 +                      _buildPermissionCard(                                                                                                                                                                 
      409 +                        icon: Icons.battery_saver_rounded,                                                                                                                                                  
      410 +                        title: 'Battery Optimization',                                                                                                                                                      
      411 +                        description:                                                                                                                                                                        
      412 +                            'Prevent the system from killing BasBC in the background.',                                                                                                                     
      413 +                        safetyNote: 'Keeps app running so blocks actually work',                                                                                                                            
      414 +                        isGranted: _batteryOptimized,                                                                                                                                                       
      415 +                        onRequest: () async {                                                                                                                                                               
      416 +                          HapticFeedback.lightImpact();                                                                                                                                                     
      417 +                          await PlatformService.requestDisableBatteryOptimization();                                                                                                                        
      418 +                        },                                                                                                                                                                                  
      419 +                        delay: 800,                                                                                                                                                                         
      420 +                        isOptional: true,                                                                                                                                                                   
      421 +                      ),                                                                                                                                                                                    
      422 +                    ],                                                                                                                                                                                      
      423 + 
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
