import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useCallback } from 'react';

export const useBiometrics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  };

  const authenticate = useCallback(async () => {
    try {
      const supported = await checkBiometricSupport();
      if (!supported) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with biometrics',
        fallbackLabel: 'Use password',
      });

      setIsAuthenticated(result.success);
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }, []);

  return { authenticate, isAuthenticated };
};
