import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import InfoScreen from './components/common/InfoScreen';
import OptionsScreen from './components/common/OptionsScreen';
import WordListScreen from './components/words/WordListScreen';
import WordEditScreen from './components/words/WordEditScreen';
import PhraseListScreen from './components/phrases/PhraseListScreen';
import PhraseEditScreen from './components/phrases/PhraseEditScreen';
import AddWordsAndPhrasesScreen from './components/common/AddWordsAndPhrasesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007acc',  // Синій фон для заголовків
          },
          headerTintColor: '#fff',   // Білий текст у заголовку
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,            // Збільшений розмір заголовка
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'VA' }} />
        <Stack.Screen name="Info" component={InfoScreen} options={{ title: 'About the App' }} />
        <Stack.Screen name="Options" component={OptionsScreen} options={{ title: 'Choose an Option' }} />
        <Stack.Screen name="WordRepetition" component={WordListScreen} options={{ title: 'Word Repetition' }} />
        <Stack.Screen name="WordEdit" component={WordEditScreen} options={{ title: 'Edit Word' }} />
        <Stack.Screen name="PhraseRepetition" component={PhraseListScreen} options={{ title: 'Phrase Repetition' }} />
        <Stack.Screen name="PhraseEdit" component={PhraseEditScreen} options={{ title: 'Edit Phrase' }} />
        <Stack.Screen name="AddWordsAndPhrases" component={AddWordsAndPhrasesScreen} options={{ title: 'Add Words and Phrases' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
