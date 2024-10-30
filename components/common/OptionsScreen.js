import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OptionsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Start Your Language Journey!</Text>

            <View style={styles.gameSection}>
                {/* Оновлена логіка переходу для гри в слова */}
                <TouchableOpacity
                    style={[styles.button, styles.practiceButton]}
                    onPress={() => navigation.navigate('WordSectionSelection')}
                    activeOpacity={0.8}
                >
                    <Icon name="pencil-outline" size={28} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Practice Words</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.button, styles.practiceButton]}
                    onPress={() => navigation.navigate('PhraseSectionSelection')}
                    activeOpacity={0.8}
                >
                    <Icon name="chatbubble-ellipses-outline" size={28} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Practice Phrases</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mistakeSection}>
                <TouchableOpacity
                    style={[styles.button, styles.errorButton]}
                    onPress={() => navigation.navigate('Mistakes')}
                    activeOpacity={0.8}
                >
                    <Icon name="refresh-circle-outline" size={28} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Review Mistakes</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.readAddSection}>
                <TouchableOpacity
                    style={[styles.button, styles.readButton]}
                    onPress={() => navigation.navigate('WordList')}
                    activeOpacity={0.8}
                >
                    <Icon name="book-outline" size={28} color="#5f7ac3" style={styles.icon} />
                    <Text style={styles.readButtonText}>Read Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.readButton]}
                    onPress={() => navigation.navigate('PhraseList')}
                    activeOpacity={0.8}
                >
                    <Icon name="book-outline" size={28} color="#5f7ac3" style={styles.icon} />
                    <Text style={styles.readButtonText}>Read Phrases</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={() => navigation.navigate('AddWordsAndPhrases')}
                    activeOpacity={0.8}
                >
                    <Icon name="add-circle-outline" size={28} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Add New Words</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        justifyContent: 'center',
        backgroundColor: '#f3e7e9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5f7ac3',
        textAlign: 'center',
        marginBottom: 25,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    gameSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mistakeSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    readAddSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 35,
        borderRadius: 20,
        marginVertical: 10,
        width: '85%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    practiceButton: {
        backgroundColor: '#5f7ac3',
    },
    errorButton: {
        backgroundColor: '#ff7373',
    },
    readButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#5f7ac3',
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    readButtonText: {
        color: '#5f7ac3',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    icon: {
        marginRight: 10,
    },
});

export default OptionsScreen;
