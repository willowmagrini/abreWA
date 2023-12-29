import React, { useState, useEffect } from 'react';
import { AppState, View, TextInput, Button, StyleSheet, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        const now = new Date();
        console.log('App has come to the foreground at:', now.toLocaleString());
  
        try {
          const text = await fetchCopiedText();
          console.log('Conteúdo da área de transferência:', text);
          parseCopiedText(text); // Processa o texto copiado
        } catch (error) {
          console.error('Erro ao acessar a área de transferência:', error);
        }
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, []);
  

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    const processedText = parseCopiedText(text);
    setInputText(processedText); // Atualiza o TextInput com o texto processado
  };

  const parseCopiedText = (text) => {
    let processedText = text.replace(/[^0-9]/g, '');

    if (processedText.startsWith('0')) {
      processedText = processedText.substring(1);
    }

    if (!processedText.startsWith('55')) {
      processedText = '55' + processedText;
    }

    return processedText;
  };

  const openWhatsApp = () => {
    if (inputText) {
      const url = `whatsapp://send?phone=${inputText}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert("Erro", "WhatsApp não está instalado neste dispositivo.");
          }
        })
        .catch((err) => console.error('Ocorreu um erro:', err));
    } else {
      Alert.alert("Erro", "Número de telefone não está definido.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
        keyboardType="numeric"
        placeholder="Digite ou cole o número aqui"
      />
      <Button title="Atualizar campo" onPress={fetchCopiedText} />
      <Button title="Abrir no WhatsApp" onPress={openWhatsApp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});
