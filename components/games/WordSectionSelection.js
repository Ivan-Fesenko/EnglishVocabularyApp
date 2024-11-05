import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Використовуємо новий Picker
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordSectionSelection = ({ navigation }) => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        try {
            const storedWords = await AsyncStorage.getItem('words');
            const wordList = storedWords ? JSON.parse(storedWords) : [];
            divideIntoSections(wordList);
        } catch (error) {
            console.error('Error loading words', error);
        }
    };

    const divideIntoSections = (wordsArray) => {
        const newSections = [];
        for (let i = 0; i < wordsArray.length; i += 50) {
            const sectionWords = wordsArray.slice(i, i + 50);
            newSections.push({
                title: `Section ${Math.floor(i / 50) + 1}`,
                data: sectionWords,
            });
        }
        setSections(newSections);
    };

    const handleSectionSelect = (sectionIndex) => {
        if (sectionIndex !== null) {
            const selectedWords = sections[sectionIndex].data;
            navigation.navigate('WordGame', { words: selectedWords });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Section</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedSection}
                    style={styles.picker}
                    onValueChange={(value) => setSelectedSection(value)}
                    mode="dropdown"
                >
                    <Picker.Item label="Select a Section" value={null} />
                    {sections.map((section, index) => (
                        <Picker.Item key={index} label={section.title} value={index} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity
                style={[
                    styles.startButton,
                    { backgroundColor: selectedSection !== null ? '#4ade80' : '#ccc' },
                ]}
                onPress={() => handleSectionSelect(selectedSection)}
                disabled={selectedSection === null}
            >
                <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    pickerContainer: {
        width: '80%',
        marginBottom: 30,
        overflow: 'hidden',
        borderColor: '#ccc',
    },
    picker: {
        width: '100%',
        height: Platform.OS === 'ios' ? 200 : 50,
    },
    startButton: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WordSectionSelection;
