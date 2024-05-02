import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import WebView from 'react-native-webview';
import Config from 'react-native-config';

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
            
            // Configuration FaceVerify
            window.FV = new FaceVerify();
            window.FV.init({
                CONTAINER_ID: 'FV_mount',
                LANGUAGE: 'en',
                ASSETS_MODE: "LOCAL",
                ASSETS_FOLDER: window.location.href.replace('index.html', 'assets'),
                TOKEN: "${Config.TOKEN}",
                onComplete: function(data) {
                    const message = JSON.stringify({ type: 'complete', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    FV.stop();
                },
                onError: function(data) {
                    const message = JSON.stringify({ type: 'error', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    FV.stop();
                },
                onUserExit: function(data) {
                    const message = JSON.stringify({ type: 'exit', data: data });
                    window.ReactNativeWebView.postMessage(message);
                    FV.stop();
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
                useWebKit
                source={{uri: './www/dist/index.html'}}
                javaScriptEnabled={true}
                originWhitelist={['*', 'https://*', 'http://*', 'data:*']}
                domStorageEnabled={true}
                allowFileAccess={true}
                style={styles.flexContainer}
                injectedJavaScript={script}
                startInLoadingState={true}
                allowsInlineMediaPlayback={true} // Allows inline playback of videos on iOS
                allowUniversalAccessFromFileURLs={true} // important for local files accessing camera
                mediaPlaybackRequiresUserAction={false} // Autoplay videos or access camera without user gestures
                mediaCapturePermissionGrantType={'grant'}
                // Add this prop to ensure permissions are handled
                onPermissionRequest={(request) => request.grant(request.resources)}
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