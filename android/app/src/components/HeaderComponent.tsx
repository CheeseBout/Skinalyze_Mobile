import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface HeaderComponentProps {
  onSearch?: (searchText: string) => void;
  onNavigate?: (screen: string) => void;
  placeholder?: string;
  title?: string;
}

export default function HeaderComponent({ 
  onSearch, 
  onNavigate,
  placeholder = "Search...",
  title = "Skinalyze"
}: HeaderComponentProps) {
  const [searchText, setSearchText] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownOptions = [
    { id: 'profile', label: 'Profile', icon: 'person-outline', screen: 'Profile' },
    { id: 'settings', label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { id: 'aboutus', label: 'About Us', icon: 'information-circle-outline', screen: 'AboutUs' },
    { id: 'logout', label: 'Logout', icon: 'log-out-outline', screen: 'Logout' },
  ];

  const handleNavigate = (screen: string) => {
    setIsDropdownVisible(false);
    onNavigate?.(screen);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch?.('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Icon with Dropdown */}
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => setIsDropdownVisible(true)}
          >
            <Ionicons name="person-outline" size={24} color="#333" />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          <Modal
            visible={isDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsDropdownVisible(false)}
          >
            <Pressable 
              style={styles.modalOverlay} 
              onPress={() => setIsDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                {dropdownOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.dropdownItem}
                    onPress={() => handleNavigate(option.screen)}
                  >
                    <Ionicons name={option.icon as any} size={20} color="#333" />
                    <Text style={styles.dropdownText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 90 : 80,
    paddingRight: 16,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});