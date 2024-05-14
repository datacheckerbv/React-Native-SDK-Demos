package com.faceverifysdkdemo

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

class CustomWebViewManager(private val reactContext: ReactApplicationContext) : SimpleViewManager<WebView>() {
    private var injectedJS: String? = null

    // Returns the name of this view manager
    override fun getName(): String {
        return "CustomWebView"
    }

    // Creates a new instance of the WebView
    override fun createViewInstance(reactContext: ThemedReactContext): WebView {
        val webView = WebView(reactContext)
        configureWebView(webView, reactContext)
        return webView
    }


    // Configures the WebView settings and clients
    private fun configureWebView(webView: WebView, context: Context) {
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
            .build()

        webView.webViewClient = object : WebViewClient() {
            // Intercepts requests to load assets from the /assets/ path
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            // For API level below 21
            override fun shouldInterceptRequest(view: WebView, url: String): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(Uri.parse(url))
            }

            // Executes JavaScript when the page has finished loading
            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                injectedJS?.let {
                    webView.evaluateJavascript(it, null)
                }
            }

        }

        webView.webChromeClient = object : WebChromeClient() {
            // Grants permissions requested by the web page
            override fun onPermissionRequest(request: android.webkit.PermissionRequest) {
                Log.d("ReactNativeWebView", "Message received: RESOURCESSSSSSSS")
                request.grant(request.resources)
            }
        }

        // Adds a JavaScript interface to communicate with React Native
        webView.addJavascriptInterface(ReactNativeWebViewInterface(webView, reactContext), "ReactNativeWebView")

        webView.settings.javaScriptEnabled = true
        webView.settings.mediaPlaybackRequiresUserGesture = false

        // Ask camera permission
        val activity = getActivity(context)
        if (activity != null && ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val cameraRequestCode = 100
                ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.CAMERA), cameraRequestCode)
            }
        }
    }

    private fun getActivity(context: Context): Activity? {
        return if (context is Activity) {
            context
        } else if (context is ThemedReactContext) {
            context.currentActivity
        } else {
            null
        }
    }

    // Sets the source URL of the WebView
    @ReactProp(name = "source")
    fun setSource(webView: WebView, source: ReadableMap) {
        val url = source.getString("uri")
        if (url != null) {
            webView.loadUrl(url)
        }
    }

    // Sets the JavaScript code to be injected into the WebView
    @ReactProp(name = "injectedJavaScript")
    fun setInjectedJavaScript(webView: WebView, jsCode: String?) {
        injectedJS = jsCode
    }

    // JavaScript interface to allow communication between WebView and React Native
    inner class ReactNativeWebViewInterface(private val webView: WebView, private val reactContext: ReactApplicationContext) {
        @JavascriptInterface
        fun postMessage(message: String?) {
            Log.d("ReactNativeWebView", "Message received: $message")
            message?.let {
                val event = Arguments.createMap()
                event.putString("data", message)
                reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
                    webView.id,
                    "topMessage",
                    event
                )
            }
        }
    }
}
