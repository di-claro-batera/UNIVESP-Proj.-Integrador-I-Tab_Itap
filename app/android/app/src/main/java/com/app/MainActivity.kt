package com.app

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "app"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : ReactActivityDelegate(this, mainComponentName) {
      override fun createRootView(): ReactRootView {
        return ReactRootView(this@MainActivity)
      }
    }
  }
}
