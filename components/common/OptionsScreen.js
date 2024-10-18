// Створення екрану для вибору опцій
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const OptionsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Button
                title="Word Repetition"
                onPress={() => navigation.navigate('WordRepetition')}
            />
            <Button
                title="Phrase Repetition"
                onPress={() => navigation.navigate('PhraseRepetition')}
                style={styles.button}
            />
            <Button
                title="Add Words and Phrases"
                onPress={() => navigation.navigate('AddWordsAndPhrases')}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
    },
});

export default OptionsScreen;
