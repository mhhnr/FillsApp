import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { AppIcons } from '../utils/icons';

export default function FormFieldEditor({ field, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) {
  const [showMenu, setShowMenu] = useState(false);

  const renderFieldSpecificInputs = () => {
    switch (field.type) {
      case 'multiple_choice':
      case 'checkbox':
        return (
          <View style={styles.optionsContainer}>
            {field.options.map((option, index) => (
              <View key={`option-${field.id}-${index}`} style={styles.optionRow}>
                <Text style={styles.icon}>
                  {field.type === 'multiple_choice' ? AppIcons.radio : AppIcons.checkbox}
                </Text>
                <TextInput
                  style={styles.optionInput}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...field.options];
                    newOptions[index] = text;
                    onUpdate(field.id, { ...field, options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor="#666666"
                />
                {index > 1 && (
                  <TouchableOpacity onPress={() => {
                    const newOptions = field.options.filter((_, i) => i !== index);
                    onUpdate(field.id, { ...field, options: newOptions });
                  }}>
                    <Text style={styles.icon}>{AppIcons.remove}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {field.options.length < 10 && (
              <TouchableOpacity 
                style={styles.addOptionButton}
                onPress={() => {
                  const newOptions = [...field.options, ''];
                  onUpdate(field.id, { ...field, options: newOptions });
                }}
              >
                <Text style={styles.icon}>{AppIcons.add}</Text>
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleRow}>
              <Text>1</Text>
              <View style={styles.scaleLine} />
              <Text>{field.scaleEnd || 5}</Text>
            </View>
            <View style={styles.scaleLabels}>
              <TextInput
                style={styles.scaleLabel}
                value={field.lowLabel}
                onChangeText={(text) => onUpdate(field.id, { ...field, lowLabel: text })}
                placeholder="Low label"
                placeholderTextColor="#666666"
              />
              <TextInput
                style={styles.scaleLabel}
                value={field.highLabel}
                onChangeText={(text) => onUpdate(field.id, { ...field, highLabel: text })}
                placeholder="High label"
                placeholderTextColor="#666666"
              />
            </View>
          </View>
        );

      case 'date':
      case 'time':
        return null; // These types don't need additional inputs

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldTypeContainer}>
          <Text style={styles.icon}>{getIconForFieldType(field.type)}</Text>
          <Text style={styles.fieldType}>
            {formatFieldType(field.type)}
          </Text>
        </View>
        
        <View style={styles.fieldActions}>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Text style={styles.icon}>{AppIcons.menu}</Text>
          </TouchableOpacity>
          
          <Menu
            visible={showMenu}
            onRequestClose={() => setShowMenu(false)}
            anchor={<View />}
          >
            <MenuItem onPress={() => {
              onDuplicate(field.id);
              setShowMenu(false);
            }}>Duplicate</MenuItem>
            <MenuItem onPress={() => {
              onDelete(field.id);
              setShowMenu(false);
            }}>Delete</MenuItem>
            <MenuItem onPress={() => {
              onMoveUp(field.id);
              setShowMenu(false);
            }}>Move Up</MenuItem>
            <MenuItem onPress={() => {
              onMoveDown(field.id);
              setShowMenu(false);
            }}>Move Down</MenuItem>
          </Menu>
        </View>
      </View>

      <TextInput
        style={styles.questionInput}
        value={field.question}
        onChangeText={(text) => onUpdate(field.id, { ...field, question: text })}
        placeholder="Enter your question"
        placeholderTextColor="#666666"
        multiline
      />

      {renderFieldSpecificInputs()}

      <View style={styles.fieldSettings}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Required</Text>
          <Switch
            value={field.required}
            onValueChange={(value) => onUpdate(field.id, { ...field, required: value })}
          />
        </View>
        
        {(field.type === 'short_text' || field.type === 'long_text') && (
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Character Limit</Text>
            <TextInput
              style={styles.limitInput}
              value={field.characterLimit?.toString()}
              onChangeText={(text) => onUpdate(field.id, { 
                ...field, 
                characterLimit: text ? Number.parseInt(text) : null 
              })}
              keyboardType="numeric"
              placeholder="No limit"
              placeholderTextColor="#666666"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldType: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#666666',
    textTransform: 'uppercase',
  },
  questionInput: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    fontFamily: 'outfit-regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addOptionButton: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000000',
    marginTop: 8,
  },
  addOptionText: {
    fontFamily: 'outfit-medium',
    color: '#000000',
  },
  fieldTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scaleContainer: {
    marginTop: 16,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
  },
  fieldSettings: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  limitInput: {
    width: 80,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    textAlign: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#666666',
  },
});

// Helper functions
const getIconForFieldType = (type) => {
  const icons = {
    short_text: AppIcons.text,
    long_text: AppIcons.document,
    multiple_choice: AppIcons.radio,
    checkbox: AppIcons.checkbox,
    date: AppIcons.calendar,
    time: AppIcons.clock,
    scale: AppIcons.options,
  };
  return icons[type] || AppIcons.help;
};

const formatFieldType = (type) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}; 