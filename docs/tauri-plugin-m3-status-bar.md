# Plugin tauri-plugin-m3 para barra de estado de Android

Plugin de Tauri para controlar el color de la barra de estado y navegación en Android, incluyendo el brillo de los iconos (claros/oscuros).

## Instalación

### 1. Agregar dependencia en Cargo.toml

```toml
[dependencies]
tauri-plugin-m3 = "0.3"
```

### 2. Registrar el plugin en Rust

En `src-tauri/src/lib.rs`:

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_m3::init())
    // ... otros plugins
```

### 3. Instalar paquete npm

```bash
bun add tauri-plugin-m3
```

### 4. Agregar permisos en capabilities

En `src-tauri/capabilities/default.json`:

```json
{
  "permissions": [
    "m3:default"
  ]
}
```

## Uso en el Frontend

```typescript
import { M3 } from "tauri-plugin-m3";

// Iconos oscuros para fondo claro
await M3.setBarColor("light");

// Iconos claros para fondo oscuro  
await M3.setBarColor("dark");

// Seguir tema del sistema
await M3.setBarColor("system");
```

### Integración con tema del sistema

En `src/routes/__root.tsx` (TanStack Start):

```typescript
import { useEffect } from "react";
import { M3 } from "tauri-plugin-m3";

export const RootComponent: React.FC = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateStatusBar = (e: MediaQueryListEvent | MediaQueryList) => {
      M3.setBarColor(e.matches ? "dark" : "light");
    };

    updateStatusBar(mediaQuery);
    mediaQuery.addEventListener("change", updateStatusBar);
    return () => mediaQuery.removeEventListener("change", updateStatusBar);
  }, []);

  return (
    // ...
  );
};
```

## Problemas de compilación encontrados

### Error: minSdkVersion 25 no puede ser menor que 26

**Síntoma:**
```
Manifest merger failed : uses-sdk:minSdkVersion 25 cannot be smaller than version 26 declared in library [:tauri-plugin-m3]
```

**Causa:** El plugin `tauri-plugin-m3` requiere minSdk 26, pero el proyecto tenía 25 hardcodeado en `gen/android/app/build.gradle.kts`.

**Solución:**
1. Editar `src-tauri/gen/android/app/build.gradle.kts`
2. Cambiar `minSdk = 25` a `minSdk = 26`

```kotlin
defaultConfig {
    minSdk = 26  // Antes era 25
    targetSdk = 36
}
```

> **Nota:** Este valor se regenera con `tauri android init`, por lo que hay que cambiarlo después de cada inicialización.

### Error: Gradle daemon desapareció

**Síntoma:**
```
Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)
```

**Causa:** Memoria insuficiente para el daemon de Gradle.

**Solución:**
Editar `src-tauri/gen/android/gradle.properties` y aumentar la memoria:

```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8
org.gradle.daemon=false
```

Después, limpiar cache y rebuild:

```bash
rm -rf src-tauri/gen/android/.gradle src-tauri/gen/android/app/build
bun run tauri android build --debug
```

## Notas

- El método `setBarColor()` cambia tanto el color de fondo como el brillo de los iconos automáticamente
- Funciona con Android 6.0+ (API 23+), pero el plugin requiere minSdk 26
- En modo dark, los iconos son blancos; en modo light, son negros
