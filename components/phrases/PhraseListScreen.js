import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import phrasesData from '../data/phrases.json'; // Імпорт JSON з фразами

const PhraseListScreen = ({ navigation, route }) => {
    const [phrases, setPhrases] = useState([]);
    const [sections, setSections] = useState([]);
    const selectedSectionIndex = route.params?.selectedSectionIndex ?? null;

    useEffect(() => {
        const initializePhrases = async () => {
            try {
                const storedPhrases = await AsyncStorage.getItem('phrases');
                let phrasesArray = storedPhrases ? JSON.parse(storedPhrases) : [];

                // Якщо AsyncStorage порожній, заповнюємо його даними з JSON
                if (phrasesArray.length === 0) {
                    phrasesArray = phrasesData.phrases;
                    await AsyncStorage.setItem('phrases', JSON.stringify(phrasesArray));
                } else {
                    // Додаємо фрази з JSON, перевіряючи на дублікати
                    phrasesData.phrases.forEach(newPhrase => {
                        const isDuplicate = phrasesArray.some(
                            phrase =>
                                phrase.phrase &&
                                newPhrase.phrase &&
                                typeof phrase.phrase === 'string' &&
                                typeof newPhrase.phrase === 'string' &&
                                phrase.phrase.toLowerCase() === newPhrase.phrase.toLowerCase()
                        );

                        if (!isDuplicate) {
                            phrasesArray.push(newPhrase);
                        }
                    });
                    await AsyncStorage.setItem('phrases', JSON.stringify(phrasesArray));
                }

                setPhrases(phrasesArray);
                divideIntoSections(phrasesArray);
            } catch (error) {
                console.error('Error loading phrases', error);
            }
        };

        initializePhrases();
        const focusListener = navigation.addListener('focus', initializePhrases);
        return focusListener;
    }, [navigation]);

    // Функція для додавання нової фрази з перевіркою на дублікат
    const addNewPhrase = async (newPhrase) => {
        try {
            // Перевірка, чи є фраза вже в масиві
            const isDuplicate = phrases.some(
                phrase =>
                    phrase.phrase &&
                    newPhrase.phrase &&
                    typeof phrase.phrase === 'string' &&
                    typeof newPhrase.phrase === 'string' &&
                    phrase.phrase.toLowerCase() === newPhrase.phrase.toLowerCase()
            );

            if (!isDuplicate) {
                const updatedPhrases = [...phrases, newPhrase];
                setPhrases(updatedPhrases);
                divideIntoSections(updatedPhrases);

                // Зберігаємо оновлений список в AsyncStorage
                await AsyncStorage.setItem('phrases', JSON.stringify(updatedPhrases));
            } else {
                Alert.alert("Duplicate Phrase", "This phrase already exists in the list.");
            }
        } catch (error) {
            console.error('Error saving new phrase', error);
        }
    };

    const divideIntoSections = (phrasesArray) => {
        const newSections = [];
        for (let i = 0; i < phrasesArray.length; i += 50) {
            const sectionPhrases = phrasesArray.slice(i, i + 50);
            newSections.push({
                title: `Section ${Math.floor(i / 50) + 1}: ${sectionPhrases.length} phrases`,
                data: sectionPhrases,
            });
        }

        if (selectedSectionIndex !== null) {
            setSections([newSections[selectedSectionIndex]]);
        } else {
            setSections(newSections);
        }
    };

    const renderItem = ({ item, index, section }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.phrase}>
                {index + 1}. {item.phrase ? item.phrase.toLowerCase() : ''} - {item.translation}
            </Text>
            <View style={styles.separator} />
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('PhraseEdit', { index, item })}>
                    <Icon name="create-outline" size={24} color="#007acc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeletePhrase(sections.indexOf(section), index)} style={styles.deleteButton}>
                    <Icon name="trash-outline" size={24} color="#ff6347" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const confirmDeletePhrase = (sectionIndex, phraseIndex) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this phrase?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deletePhrase(sectionIndex, phraseIndex),
                },
            ],
            { cancelable: true }
        );
    };

    const deletePhrase = async (sectionIndex, phraseIndex) => {
        const sectionPhrases = sections[sectionIndex].data;
        const updatedPhrases = sectionPhrases.filter((_, index) => index !== phraseIndex);
        const allPhrases = sections.flatMap((section) => section.data);
        allPhrases.splice(sectionIndex * 50 + phraseIndex, 1);
        setPhrases(allPhrases);
        divideIntoSections(allPhrases);
        await AsyncStorage.setItem('phrases', JSON.stringify(allPhrases));
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.phrase}-${index}`} // Унікальний ключ для кожного елемента
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No phrases added yet.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f3e7e9',
    },
    sectionHeaderContainer: {
        backgroundColor: 'rgba(95, 122, 195, 0.7)', // Прозорий фон
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        elevation: 2,
    },
    sectionHeaderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    phrase: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        marginLeft: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default PhraseListScreen;
