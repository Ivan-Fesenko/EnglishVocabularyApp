import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhraseEditScreen = ({ route, navigation }) => {
    const { index, item } = route.params;
    const [phrase, setPhrase] = useState(item.phrase);
    const [translation, setTranslation] = useState(item.translation);

    const saveEdit = async () => {
        try {
            const storedPhrases = await AsyncStorage.getItem('phrases');
            const phrases = storedPhrases ? JSON.parse(storedPhrases) : [];
            phrases[index] = { phrase, translation };  // Update the phrase
            await AsyncStorage.setItem('phrases', JSON.stringify(phrases));
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={phrase}
                onChangeText={setPhrase}
            />
            <TextInput
                style={styles.input}
                value={translation}
                onChangeText={setTranslation}
            />
            <Button title="Save Changes" onPress={saveEdit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default PhraseEditScreen;
