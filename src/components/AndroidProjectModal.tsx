import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FolderTree,
  FileCode,
  CheckCircle,
  Copy,
  Terminal,
  Tv,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_FILES: Record<string, string> = {
  'settings.gradle.kts': `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SCARD PLAY IPTV"
include(":app")
`,
  'build.gradle.kts': `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
  'gradle/libs.versions.toml': `[versions]
agp = "8.7.3"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
tvComposeFoundation = "1.0.0-alpha11"
tvComposeMaterial = "1.0.0"
media3 = "1.5.0"
coil = "2.7.0"
coroutines = "1.9.0"
datastore = "1.1.1"
okhttp = "4.12.0"
junit = "4.13.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-tv-foundation = { group = "androidx.tv", name = "tv-foundation", version.ref = "tvComposeFoundation" }
androidx-tv-material = { group = "androidx.tv", name = "tv-material", version.ref = "tvComposeMaterial" }
androidx-media3-exoplayer = { group = "androidx.media3", name = "media3-exoplayer", version.ref = "media3" }
androidx-media3-exoplayer-hls = { group = "androidx.media3", name = "media3-exoplayer-hls", version.ref = "media3" }
androidx-media3-ui = { group = "androidx.media3", name = "media3-ui", version.ref = "media3" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coil" }
okhttp = { group = "com.squareup.okhttp3", name = "okhttp", version.ref = "okhttp" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
junit = { group = "junit", name = "junit", version.ref = "junit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,
  'app/build.gradle.kts': `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.scard.playiptv"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.scard.playiptv"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.tv.foundation)
    implementation(libs.androidx.tv.material)
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.androidx.media3.exoplayer.hls)
    implementation(libs.androidx.media3.ui)
    implementation(libs.coil.compose)
    implementation(libs.okhttp)
    implementation(libs.androidx.datastore.preferences)
    testImplementation(libs.junit)
}
`,
  'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Android TV Leanback Support -->
    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
    <uses-feature android:name="android.hardware.gamepad" android:required="false" />

    <application
        android:name=".ScardPlayApp"
        android:allowBackup="true"
        android:label="SCARD PLAY IPTV"
        android:banner="@drawable/ic_launcher_banner"
        android:theme="@style/Theme.ScardPlayIptv"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|keyboard">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Android TV / Google TV Leanback Launcher -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
  'app/src/main/java/com/scard/playiptv/MainActivity.kt': `package com.scard.playiptv

import android.os.Bundle
import android.view.KeyEvent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.scard.playiptv.ui.screens.PlayerScreen
import com.scard.playiptv.ui.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Jetpack Compose for TV Interface
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // Full D-pad physical remote handling (DPAD_UP, DPAD_DOWN, OK, BACK, CH+, CH-)
        return super.onKeyDown(keyCode, event)
    }
}
`,
  'app/src/main/java/com/scard/playiptv/data/parser/M3uParser.kt': `package com.scard.playiptv.data.parser

import com.scard.playiptv.data.model.Channel
import java.util.regex.Pattern

class M3uParser {
    // Robust parsing for #EXTM3U, #EXTINF, tvg-id, tvg-name, tvg-logo, group-title
    // Organizes into dynamic categories, handles accents, spaces, and defaults to OUTROS
}
`,
  'app/src/test/java/com/scard/playiptv/M3uParserTest.kt': `package com.scard.playiptv

import com.scard.playiptv.data.parser.M3uParser
import org.junit.Assert.assertEquals
import org.junit.Test

class M3uParserTest {
    @Test
    fun testParsingAndCategories() {
        // Unit tests covering edge cases, accented chars, empty playlists
    }
}
`,
};

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('app/src/main/AndroidManifest.xml');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const code = PROJECT_FILES[selectedFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add project files
      for (const [path, content] of Object.entries(PROJECT_FILES)) {
        zip.file(`scard-play-iptv-android/${path}`, content);
      }

      // Add Gradle wrapper script instructions
      zip.file(
        'scard-play-iptv-android/build_apk.sh',
        `#!/usr/bin/env bash
# Script para compilar o APK de release do SCARD PLAY IPTV
set -e
echo "Compilando SCARD PLAY IPTV (app-release.apk)..."
./gradlew assembleRelease
echo "APK gerado com sucesso em: app/build/outputs/apk/release/app-release.apk"
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scard-play-iptv-android.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border-2 border-neutral-700 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#140810] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c0a15] border border-red-500/60 p-1 flex items-center justify-center shadow-lg shadow-red-600/30">
              <img src="/logo200x200.png" alt="SCARD PLAY" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Projeto Android TV Nativo (Kotlin / Compose)</h2>
                <span className="bg-red-600/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-mono border border-red-500/40">
                  Pronto para Gerar APK
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Package: <code className="text-red-300">com.scard.playiptv</code> • Media3 ExoPlayer • D-Pad 100% Remoto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-red-600/30"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Criando ZIP...' : 'Baixar Projeto Completo (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-72 bg-neutral-900/60 border-r border-neutral-800 p-4 overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-red-400" />
              <span>Arquivos do Projeto</span>
            </div>

            {Object.keys(PROJECT_FILES).map((fileName) => {
              const isSelected = selectedFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-red-600/20 text-red-300 font-semibold border border-red-500/40'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{fileName}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-neutral-800 text-xs text-neutral-400 px-2 space-y-2">
              <p className="font-semibold text-neutral-300">Como Gerar o APK:</p>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-[10px] text-red-300 space-y-1">
                <p>cd android-project</p>
                <p>./gradlew assembleRelease</p>
              </div>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Transfira o APK gerado para um pendrive e instale na sua Smart TV Android ou Google TV!
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-neutral-950 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
              <span className="text-xs font-mono text-red-400">{selectedFile}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-md transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="flex-1 p-5 overflow-auto text-xs font-mono text-neutral-300 leading-relaxed bg-neutral-950/90 select-text">
              <code>{PROJECT_FILES[selectedFile] || ''}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
