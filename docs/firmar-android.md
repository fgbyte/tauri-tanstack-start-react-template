# Firmar App Android

Para publicar en Google Play, necesitas firmar tu app con un certificado digital.

Android App Bundles y APKs deben estar firmados antes de ser subidos para distribución.

## Crear un keystore y clave de upload

La firma de Android requiere un archivo Java Keystore que puede generarse usando la CLI `keytool`:

**macOS / Linux:**

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

**Windows:**

```bash
keytool -genkey -v -keystore $env:USERPROFILE\upload-keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Este comando guarda el archivo `upload-keystore.jks` en tu directorio home.

> **Nota:** El comando `keytool` puede no estar en tu PATH. Lo encuentras en el JDK instalado con Android Studio:
>
> - Linux: `/opt/android-studio/jbr/bin/keytool`
> - macOS: `/Applications/Android\ Studio.app/Contents/jbr/Contents/Home/bin/keytool`
> - Windows: `C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe`

> **Advertencia:** Mantén el archivo `keystore` privado, no lo subas a repositorios públicos.

## Configurar la clave de firma

Crea un archivo en `[project]/src-tauri/gen/android/keystore.properties`:

```properties
password=<password que definiste cuando ejecutaste keytool>
keyAlias=upload
storeFile=<ruta al archivo keystore, ej: /Users/tu-usuario/upload-keystore.jks o C:\Users\tu-usuario\upload-keystore.jks>
```

> **Advertencia:** Mantén el archivo `keystore.properties` privado, no lo subas a repositorios públicos.

### Configurar Gradle para usar la clave de firma

Edita el archivo `[project]/src-tauri/gen/android/app/build.gradle.kts`:

1. Añade el import al inicio del archivo:

   ```kotlin
   import java.io.FileInputStream
   ```

2. Añade la configuración de firma antes del bloque `buildTypes`:

   ```kotlin
   signingConfigs {
       create("release") {
           val keystorePropertiesFile = rootProject.file("keystore.properties")
           val keystoreProperties = Properties()
           if (keystorePropertiesFile.exists()) {
               keystoreProperties.load(FileInputStream(keystorePropertiesFile))
           }

           keyAlias = keystoreProperties["keyAlias"] as String
           keyPassword = keystoreProperties["password"] as String
           storeFile = file(keystoreProperties["storeFile"] as String)
           storePassword = keystoreProperties["password"] as String
       }
   }
   buildTypes {
       // ...
   }
   ```

3. Usa la config de firma en el bloque `buildTypes`:
   ```kotlin
   buildTypes {
       getByName("release") {
           signingConfig = signingConfigs.getByName("release")
       }
   }
   ```

Ahora los builds en modo release se firmarán automáticamente.

## Ejemplo: GitHub Actions

```yaml
- name: setup Android signing
  run: |
    cd src-tauri/gen/android
    echo "keyAlias=${{ secrets.ANDROID_KEY_ALIAS }}" > keystore.properties
    echo "password=${{ secrets.ANDROID_KEY_PASSWORD }}" >> keystore.properties
    base64 -d <<< "${{ secrets.ANDROID_KEY_BASE64 }}" > $RUNNER_TEMP/keystore.jks
    echo "storeFile=$RUNNER_TEMP/keystore.jks" >> keystore.properties
```

En este ejemplo, el keystore fue exportado a base64 con `base64 -i /path/to/keystore.jks` y configurado como secreto `ANDROID_KEY_BASE64`.

## Más información

- [Documentación oficial de Android sobre firmas](https://developer.android.com/studio/publish/app-signing#generate-key)
- [Play App Signing de Google](https://support.google.com/googleplay/android-developer/answer/9842756?hl=es)
