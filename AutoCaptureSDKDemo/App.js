import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Platform } from 'react-native';
import WebView from 'react-native-webview';
import Config from 'react-native-config';

import * as RNFS from 'react-native-fs';  // if using react-native-fs to resolve file paths

const localFilePath = Platform.OS === 'ios' ? `file://${RNFS.MainBundlePath}/www/dist/index.html` : `file:///android_asset/www/dist/index.html`;
const localDirPath = Platform.OS === 'ios' ? `file://${RNFS.MainBundlePath}/www/dist/assets` : 'https://appassets.androidplatform.net/assets/www/dist/assets';

const App = () => {
    const [webViewVisible, setWebViewVisible] = useState(true);

    const script = `
            // Override the console.log function
            console.log = (...args) => {
            // Combine all arguments into a single string
            const message = args.map(arg => {
                // Convert each argument to a string, handling objects via JSON.stringify
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            }).join(' ');
            
            // Send the combined message to the WebView
            window.ReactNativeWebView.postMessage(message);
            };
            
            // Configuration AutoCapture
            window.AC = new AutoCapture();
            window.AC.init({
                CONTAINER_ID: 'AC_mount',
                LANGUAGE: 'en',
                ASSETS_MODE: "LOCAL",
                ASSETS_FOLDER: "${localDirPath}",
                TOKEN: "${Config.TOKEN}",
                onComplete: function(data) {
                    const message = JSON.stringify({ type: 'complete', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    AC.stop();
                },
                onError: function(data) {
                    const message = JSON.stringify({ type: 'error', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    AC.stop();
                },
                onUserExit: function(data) {
                    const message = JSON.stringify({ type: 'exit', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    AC.stop();
                }
            });
        `

    const handleMessage = (event) => {
        let message;
        try {
            message = JSON.parse(event.nativeEvent.data);
            if (!message.type) {
                message = { type: 'webViewLog', data: message };
            }
        } catch (e) {
            message = { type: 'webViewLog', data: { message: event.nativeEvent.data } };
        }
                
        switch (message.type) {
            case 'complete':
            console.log('Completion data:', message.data);
            setWebViewVisible(false);
            break;
            case 'error':
            console.log('Error:', message.data);
            setWebViewVisible(false);
            break;
            case 'exit':
            console.log('User exited:', message.data);
            setWebViewVisible(false);
            break;
            case 'webViewLog':
            console.log('webViewLog:', message.data);
            break;
            default:
            console.log('Received unknown message type.', message.type);
            console.log(message)
            setWebViewVisible(false);
        }
    };
          

    return (
        <SafeAreaView style={styles.flexContainer}>
        {webViewVisible ? (
            <WebView
                source={{uri: localFilePath}}
                javaScriptEnabled={true}
                originWhitelist={['*']}
                domStorageEnabled={true}
                style={styles.flexContainer}
                injectedJavaScript={script}
                allowsInlineMediaPlayback={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccess={true}
                mediaPlaybackRequiresUserAction={false}
                mediaCapturePermissionGrantType={'grant'}
                onMessage={handleMessage}
                onError={(event) => {
                    console.log(event.nativeEvent.data);
                    setWebViewVisible(false);
                }}
                />
            ) : (
            <View style={styles.centeredContent}>
                <Button title="Reload WebView" onPress={() => setWebViewVisible(true)} />
            </View>
        )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;