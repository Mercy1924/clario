import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSessionStore } from '../../stores/session-store';

type CaptureMode = 'photo' | 'multi' | 'scan';

export default function CaptureScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { currentSpace, setCurrentSpace } = useSessionStore();

  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need camera access to capture your space
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.uri) {
        if (captureMode === 'multi') {
          setCapturedImages((prev) => [...prev, photo.uri!]);
        } else {
          setCapturedImages([photo.uri!]);
          // For single photo mode, proceed to analysis
          proceedToAnalysis([photo.uri!]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleScan = () => {
    if (isScanning) return;

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // In production, this would be the actual scan result
          proceedToAnalysis(['scan-result']);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const proceedToAnalysis = (images: string[]) => {
    // Update space with captured images
    if (currentSpace) {
      setCurrentSpace({
        ...currentSpace,
        images,
      });
    }
    router.push('/session/analysis');
  };

  const handleRetake = () => {
    setCapturedImages([]);
  };

  const handleProceed = () => {
    if (capturedImages.length > 0) {
      proceedToAnalysis(capturedImages);
    }
  };

  return (
    <View style={styles.container}>
      {/* Context Indicator */}
      {currentSpace?.type && (
        <View style={styles.contextIndicator}>
          <Text style={styles.contextText}>
            Context set: {currentSpace.type}
          </Text>
        </View>
      )}

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          mute={true}
        />

        {/* Scan Progress Overlay */}
        {isScanning && (
          <View style={styles.scanOverlay}>
            <View style={styles.scanProgressContainer}>
              <View
                style={[
                  styles.scanProgressBar,
                  { width: `${scanProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.scanProgressText}>{scanProgress}%</Text>
            <Text style={styles.scanInstruction}>
              Move slowly around your room
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Mode Toggle */}
        {!isScanning && capturedImages.length === 0 && (
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                captureMode === 'photo' && styles.modeButtonActive,
              ]}
              onPress={() => setCaptureMode('photo')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  captureMode === 'photo' && styles.modeButtonTextActive,
                ]}
              >
                Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                captureMode === 'multi' && styles.modeButtonActive,
              ]}
              onPress={() => setCaptureMode('multi')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  captureMode === 'multi' && styles.modeButtonTextActive,
                ]}
              >
                Multi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                captureMode === 'scan' && styles.modeButtonActive,
              ]}
              onPress={handleScan}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  captureMode === 'scan' && styles.modeButtonTextActive,
                ]}
              >
                Scan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Capture Button or Retake/Proceed */}
        {capturedImages.length === 0 ? (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isScanning}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceed}
            >
              <Text style={styles.proceedButtonText}>
                {captureMode === 'multi'
                  ? `Continue (${capturedImages.length})`
                  : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contextIndicator: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  contextText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scanProgressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scanProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  scanProgressText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  scanInstruction: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    backgroundColor: '#000',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#333',
  },
  modeButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  retakeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  proceedButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
