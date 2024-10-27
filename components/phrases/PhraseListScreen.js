import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const PhraseListScreen = ({ navigation }) => {
    const [phrases, setPhrases] = useState([]);

    useEffect(() => {
        const loadPhrases = async () => {
            try {
                const storedPhrases = await AsyncStorage.getItem('phrases');
                if (storedPhrases) {
                    setPhrases(JSON.parse(storedPhrases));
                }
            } catch (error) {
                console.error(error);
            }
        };

        const focusListener = navigation.addListener('focus', () => {
            loadPhrases();
        });

        return focusListener;
    }, [navigation]);

    const confirmDeletePhrase = (index) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this phrase?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deletePhrase(index),
                },
            ],
            { cancelable: true }
        );
    };

    const deletePhrase = async (index) => {
        let updatedPhrases = [...phrases];
        updatedPhrases.splice(index, 1);
        setPhrases(updatedPhrases);
        await AsyncStorage.setItem('phrases', JSON.stringify(updatedPhrases));
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            {/* Обмежуємо висоту для фрази і додаємо можливість прокручування */}
            <ScrollView style={styles.phraseContainer}>
                <Text style={styles.phrase}>{item.phrase} - {item.translation}</Text>
            </ScrollView>
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('PhraseEdit', { index, item })}>
                    <Icon name="create-outline" size={24} color="#007acc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeletePhrase(index)}>
                    <Icon name="trash-outline" size={24} color="#ff6347" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={phrases}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    // Контейнер для фрази з фіксованою висотою
    phraseContainer: {
        maxHeight: 60,  // Обмежуємо висоту
        flex: 1,
    },
    phrase: {
        fontSize: 16,
        color: '#333',
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 10,  // Додаємо відступ, щоб іконки не торкалися фрази
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default PhraseListScreen;
