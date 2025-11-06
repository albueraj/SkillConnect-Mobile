import React from 'react';
import {
  // Removed SafeAreaView
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the list
const blockedData = [
  { id: '1', name: 'Juan Dela Cruz', service: 'Mechanical', rating: '1.0' },
  { id: '2', name: 'Juan Dela Cruz', service: 'Plumbing', rating: '1.0' },
];

const WorkerRow = ({ item }) => (
  <View style={styles.tableRow}>
    <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
    <Text style={[styles.tableCell, styles.serviceCell]}>{item.service}</Text>
    <View style={[styles.tableCell, styles.ratingCell]}>
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={styles.ratingText}>{item.rating}</Text>
    </View>
  </View>
);

const Blocked = ({ navigation }) => {
  return (
    // Use a regular View as the container
    <View style={styles.container}>
      {/* The custom header has been removed. The navigator will add it. */}

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
        <Text style={[styles.headerCell, styles.serviceCell]}>Service Type</Text>
        <Text style={[styles.headerCell, styles.ratingCell]}>Ratings</Text>
      </View>

      {/* Table Body */}
      <FlatList
        data={blockedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <WorkerRow item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    
    
  },
  // Removed custom header, backButton, and headerTitle styles
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  nameCell: {
    flex: 2,
  },
  serviceCell: {
    flex: 2,
    textAlign: 'left',
  },
  ratingCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default Blocked;