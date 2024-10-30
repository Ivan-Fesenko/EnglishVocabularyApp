import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhraseSectionSelection = ({ navigation }) => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        loadPhrases();
    }, []);

    const loadPhrases = async () => {
        try {
            const storedPhrases = await AsyncStorage.getItem('phrases');
            const phraseList = storedPhrases ? JSON.parse(storedPhrases) : [];
            divideIntoSections(phraseList);
        } catch (error) {
            console.error('Error loading phrases', error);
        }
    };

    const divideIntoSections = (phrasesArray) => {
        const newSections = [];
        for (let i = 0; i < phrasesArray.length; i += 50) {
            const sectionPhrases = phrasesArray.slice(i, i + 50);
            newSections.push({
                title: `Section ${Math.floor(i / 50) + 1}`,
                data: sectionPhrases,
            });
        }
        setSections(newSections);
    };

    const handleSectionSelect = () => {
        if (selectedSection !== null) {
            const selectedPhrases = sections[selectedSection].data;
            navigation.navigate('PhraseGame', { selectedPhrases });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Phrase Section</Text>
            <Picker
                selectedValue={selectedSection}
                style={styles.picker}
                onValueChange={(value) => setSelectedSection(value)}
            >
                <Picker.Item label="Select a Section" value={null} />
                {sections.map((section, index) => (
                    <Picker.Item key={index} label={section.title} value={index} />
                ))}
            </Picker>

            <TouchableOpacity
                style={[
                    styles.startButton,
                    { backgroundColor: selectedSection !== null ? '#4ade80' : '#ccc' },
                ]}
                onPress={handleSectionSelect}
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
    picker: {
        width: '80%',
        height: Platform.OS === 'ios' ? 200 : 50,
    },
    startButton: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PhraseSectionSelection;
