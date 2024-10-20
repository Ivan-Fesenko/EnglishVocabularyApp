import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';

import HomeScreen from './components/HomeScreen';
import InfoScreen from './components/common/InfoScreen';
import OptionsScreen from './components/common/OptionsScreen';
import WordListScreen from './components/words/WordListScreen';
import WordEditScreen from './components/words/WordEditScreen';
import PhraseListScreen from './components/phrases/PhraseListScreen';
import PhraseEditScreen from './components/phrases/PhraseEditScreen';
import AddWordsAndPhrasesScreen from './components/common/AddWordsAndPhrasesScreen';
import WordGame from './components/games/WordGame';
import PhraseGame from './components/games/PhraseGame';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4f5f0',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          },
          headerTintColor: '#3a3a3a',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
          },
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={{ paddingRight: 10 }}>
              <Image
                source={require('./assets/1.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Vocabulary App' }}
        />
        <Stack.Screen
          name="Info"
          component={InfoScreen}
          options={{ title: 'About the App' }}
        />
        <Stack.Screen
          name="Options"
          component={OptionsScreen}
          options={{ title: 'Choose an Option' }}
        />
        <Stack.Screen
          name="WordList"
          component={WordListScreen}
          options={{ title: 'Word List' }}
        />
        <Stack.Screen
          name="WordEdit"
          component={WordEditScreen}
          options={{ title: 'Edit Word' }}
        />
        <Stack.Screen
          name="PhraseList"
          component={PhraseListScreen}
          options={{ title: 'Phrase List' }}
        />
        <Stack.Screen
          name="PhraseEdit"
          component={PhraseEditScreen}
          options={{ title: 'Edit Phrase' }}
        />
        <Stack.Screen
          name="AddWordsAndPhrases"
          component={AddWordsAndPhrasesScreen}
          options={{ title: 'Add Words and Phrases' }}
        />
        <Stack.Screen
          name="WordGame"
          component={WordGame}
          options={{ title: 'Word Game' }}
        />
        <Stack.Screen
          name="PhraseGame"
          component={PhraseGame}
          options={{ title: 'Phrase Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
