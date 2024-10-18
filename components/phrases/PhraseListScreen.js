import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const deletePhrase = async (index) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this phrase?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        let updatedPhrases = [...phrases];
                        updatedPhrases.splice(index, 1);
                        setPhrases(updatedPhrases);
                        await AsyncStorage.setItem('phrases', JSON.stringify(updatedPhrases));
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={phrases}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.phraseItem}>
                        <Text>{item.phrase} - {item.translation}</Text>
                        <Button title="Edit" onPress={() => navigation.navigate('PhraseEdit', { index, item })} />
                        <Button title="Delete" onPress={() => deletePhrase(index)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    phraseItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default PhraseListScreen;
