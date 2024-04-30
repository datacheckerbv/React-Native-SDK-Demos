import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const App = () => {
    const script = `
            console.log = window.ReactNativeWebView.postMessage

            // console.log(navigator.mediaDevices+'mediaa')


            window.FV = new FaceVerify();
            console.log(window.FV)
            console.log('window', window)
            window.FV.init({
                CONTAINER_ID: 'FV_mount',
                LANGUAGE: 'en',
                ASSETS_MODE: "LOCAL",
                ASSETS_FOLDER: window.location.href.replace('index.html', 'assets'),
                DEBUG: true,
                TOKEN: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX3Nka19saXN0IjpbIkFVVE9fQ0FQVFVSRSIsIkZBQ0VfVkVSSUZZIiwiTkZDIl0sImNoYWxsZW5nZXMiOlsidXAiLCJyaWdodCJdLCJkZW1vIjp0cnVlLCJ0cmFuc2FjdGlvbl9pZCI6IjkxNGNlYjQ0LTViZWYtNDA3YS1iZWYwLWE2NDY5OTM2NGViZSIsImV4cCI6MTc1MTI3NzYwMH0.glotYAX0FH2vR9SwVWJ2jB2aYPpFxknudca3DBoa1MZbSRY1JiteGhcQbMik2_HQFebZ5OxrXUDS7fH8PTwI1KqnOOfJBTJ2q3bth6x8bOsztDtopBP9kdlYR2MMfFRE2MqGBztvWosv7aD2Bn0Lfb1M1h-BgThnQEBmMGS_zgEH-q11FbaV2xcySml6ELCkFW7ICSqJylR1faNMggsbJC0agdv60P4t3do8JdD6PvxmW0JxYVxRN3_kNC1lWnTGJ5UJl912MuL9YOSsLwfaTpuGMAYrAzxBkIWqH_N9xIw_NH-azcdB4yPMUPKttu29IHYIs0Q2cyi8UqmSHlch2TK31B4H-F1MqNtLKAMtyWVytzps3Np2AuSdp4g946qsJJ3DCWwWTcnYGS-u1ZRHwyssAuE5uQdDuJ7YOtNP73uELqBs95ODHYYM0849lG5pMjViYNatTcQgF7e5ormBaaa9Yc5qiiIuH3hs8A98VOTvIl5gYwbz0DwdFEeyrVuI8k-t3SA1UUJAwoNtHm70bPmFPKzSleYl-ugWmBXPMOJi5wuE0V0OHI4jJN4vvAz3k_LpEAhinQe_L4AS1QwtZjeb-KumEbMWQ_3JerJ7xe0fb_RkJaMDtYkl6Sb8ftX_mhpy5qGgqNihyyRyweGrcuvOT3Qz8EUCZVSdK-NcAMM",
                onComplete: function(data) {
                    console.log(data);
                    window.webkit.messageHandlers.output.postMessage(data);
                    FV.stop();
                },
                onError: function(error) {
                    console.log(error);
                    FV.stop();
                },
                onUserExit: function(error) {
                    console.log(error);
                    FV.stop();
                }
            });
        `

  return (
    <SafeAreaView style={styles.flexContainer}>
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
        onMessage={(event) => {
            // Log the message to the console
            // console.log(event);
            console.log(event.nativeEvent.data);
          }}
        onError={(event) => {
            // Log the message to the console
            // console.log(event);
            console.log(event.nativeEvent.data);
          }}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1
  }
});

export default App;