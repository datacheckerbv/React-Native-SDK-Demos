# React-Native-SDK-Demos

## Overview

This guide provides the necessary steps to set up and run the React Native SDK demos, specifically for the FaceVerify SDK. Follow these instructions to ensure correct configuration for both Android and iOS platforms.

## Prerequisites

1. **Copy SDK:** Place the FaceVerify SDK into a shared folder named `www`. This folder will act as the central location from which both Android and iOS projects will link to the SDK.

2. **Environment Variables:** Create an `.env` file at the root of your project to store configuration like your SDK token. This helps in keeping sensitive information out of your code base.

```plaintext
TOKEN="YOUR_SDK_TOKEN"
```

## iOS Specific Setup

### Managing Dependencies with CocoaPods (iOS)

Before proceeding, make sure CocoaPods is installed on your system. Run the following command in the terminal within your iOS project directory:

```bash
pod install
```

### Linking the SDK (iOS)

1. **Symbolic Link Creation:**
   - Open Xcode, then navigate to `FaceVerifySDKDemo/ios/FaceVerifySDKDemo.xcworkspace`.
   - Drag the `www` folder into the Xcode project navigator under `FaceVerifySDKDemo`.
   - Important: Ensure `Copy items if needed` is unchecked to use symbolic links, and `Create folder references` is checked for proper folder nesting.

### App Permissions (iOS)

Add necessary permissions in the `info.plist` to ensure the app has access to required device capabilities:

```xml
<key>NSCameraUsageDescription</key>
<string>Allow access to the camera</string>
```

### Building and Running (iOS)

Finally, build and run your application using the following command to ensure all configurations are applied:

```bash
npx react-native run-ios
```

## Android Specific Setup

For Android, using the `react-native-webview` component to load the SDK locally is not possible. This is because Android does not allow fetching from `file://` URLs. Instead, it only permits loading from `https://` URLs. Therefore, the files need to be hosted, either internally or externally. To host the files internally, we created a `CustomWebView` component specifically for Android.

### Linking the SDK (Android)

To link the assets for your Android project, run the following commands in your terminal:

```bash
mkdir -p android/app/src/main/assets
ln -s "$(realpath ./www)" android/app/src/main/assets/www
```

### Managing Dependencies (Android)

Add the following dependency to your `build.gradle` file to manage web components and environment configurations:

```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
implementation("androidx.webkit:webkit:1.4.0")
```

In your `AndroidManifest.xml` file, ensure you include the necessary permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### Building and Running (Android)

To build and run your application, use the following command. This will apply all the configurations you have set up:

```bash
npx react-native run-android
```
