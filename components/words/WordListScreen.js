import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const WordListScreen = ({ navigation, route }) => {
    const [words, setWords] = useState([]);
    const [sections, setSections] = useState([]);
    const selectedSectionIndex = route.params?.selectedSectionIndex ?? null;

    useEffect(() => {
        const loadWords = async () => {
            try {
                const storedWords = await AsyncStorage.getItem('words');
                if (storedWords !== null) {
                    const parsedWords = JSON.parse(storedWords);
                    setWords(parsedWords);
                    divideIntoSections(parsedWords);
                }
            } catch (error) {
                console.error('Error loading words', error);
            }
        };

        const focusListener = navigation.addListener('focus', () => {
            loadWords();
        });

        return focusListener;
    }, [navigation]);

    const divideIntoSections = (wordsArray) => {
        const newSections = [];
        for (let i = 0; i < wordsArray.length; i += 50) {
            const sectionWords = wordsArray.slice(i, i + 50);
            newSections.push({
                title: `Section ${Math.floor(i / 50) + 1}: ${sectionWords.length} words`,
                data: sectionWords,
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
            <Text style={styles.word}>
                {index + 1}. {item.word ? item.word.toLowerCase() : ''} - {item.translation}
            </Text>
            <View style={styles.separator} />
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('WordEdit', { index, item })}>
                    <Icon name="create-outline" size={24} color="#007acc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteWord(sections.indexOf(section), index)} style={styles.deleteButton}>
                    <Icon name="trash-outline" size={24} color="#ff6347" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const confirmDeleteWord = (sectionIndex, wordIndex) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this word?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteWord(sectionIndex, wordIndex),
                },
            ],
            { cancelable: true }
        );
    };

    const deleteWord = async (sectionIndex, wordIndex) => {
        const sectionWords = sections[sectionIndex].data;
        const updatedWords = sectionWords.filter((_, index) => index !== wordIndex);
        const allWords = sections.flatMap((section) => section.data);
        allWords.splice(sectionIndex * 50 + wordIndex, 1);
        setWords(allWords);
        divideIntoSections(allWords);
        await AsyncStorage.setItem('words', JSON.stringify(allWords));
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No words added yet.</Text>}
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
    word: {
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

export default WordListScreen;
