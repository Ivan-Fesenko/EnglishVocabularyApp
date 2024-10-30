import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const PhraseListScreen = ({ navigation }) => {
    const [phrases, setPhrases] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const loadPhrases = async () => {
            try {
                const storedPhrases = await AsyncStorage.getItem('phrases');
                if (storedPhrases) {
                    const parsedPhrases = JSON.parse(storedPhrases);
                    setPhrases(parsedPhrases);
                    divideIntoSections(parsedPhrases);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const focusListener = navigation.addListener('focus', loadPhrases);
        return focusListener;
    }, [navigation]);

    const divideIntoSections = (phrasesArray) => {
        const newSections = [];
        for (let i = 0; i < phrasesArray.length; i += 50) {
            const sectionPhrases = phrasesArray.slice(i, i + 50);
            newSections.push({
                title: `Section ${Math.floor(i / 50) + 1}: ${sectionPhrases.length} phrases`,
                data: sectionPhrases,
            });
        }
        setSections(newSections);
    };

    const renderItem = ({ item, index, section }) => (
        <View style={styles.itemContainer}>
            <ScrollView style={styles.phraseContainer}>
                <Text style={styles.phrase}>
                    {index + 1}. {item.phrase ? item.phrase : ''} - {item.translation}
                </Text>
            </ScrollView>
            <View style={styles.separator} />
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('PhraseEdit', { index, item })}>
                    <Icon name="create-outline" size={24} color="#007acc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeletePhrase(sections.indexOf(section), index)}>
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
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
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
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    phraseContainer: {
        maxHeight: 60,
        flex: 1,
    },
    phrase: {
        fontSize: 16,
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
        marginLeft: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default PhraseListScreen;
