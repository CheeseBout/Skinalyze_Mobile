import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AnalyzeScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null)
  const [facing, setFacing] = useState<CameraType>('back')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const cameraRef = useRef<CameraView>(null)

  React.useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync()
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted')
      
      // Request camera permission on component mount
      if (!permission?.granted) {
        await requestPermission()
      }
    })()
  }, [])

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        })
        
        if (photo?.uri) {
          setCapturedImage(photo.uri)
          
          // Save to media library if permission granted
          if (hasMediaLibraryPermission) {
            try {
              await MediaLibrary.saveToLibraryAsync(photo.uri)
            } catch (error) {
              console.log('Media library save failed:', error)
            }
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture')
        console.error('Take picture error:', error)
      }
    }
  }

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
      console.error('Pick image error:', error)
    }
  }

  const analyzeImage = () => {
    if (capturedImage) {
      // TODO: Implement image analysis logic
      Alert.alert('Analyze', 'Image analysis feature will be implemented here')
    }
  }

  const resetImage = () => {
    setCapturedImage(null)
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
        >

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Gallery Button */}
            <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
              <Ionicons name="images-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity onPress={takePicture}>
              <View style={styles.captureButtonInner}>
                <FontAwesome name="circle" size={70} color="white" />
              </View>
            </TouchableOpacity>

            {/* Flip Camera Button */}
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <MaterialCommunityIcons name="camera-flip" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Image Preview Modal */}
      {capturedImage && (
        <View style={styles.imagePreviewModal}>
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
                <Text style={styles.buttonText}>Analyze Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
                <Text style={styles.buttonText}>Take New Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  galleryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 12,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    gap: 20,
  },
  previewImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  analyzeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
})