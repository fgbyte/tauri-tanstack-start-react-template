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

// Iconos claros para fondo oscuro
await M3.setBarColor("dark");

// Iconos oscuros para fondo claro
await M3.setBarColor("light");

// Seguir tema del sistema
await M3.setBarColor("system");
```

### Integración completa con tema del sistema + insets

En `src/routes/__root.tsx` (TanStack Start):

```typescript
import { useEffect, useState } from "react";
import { M3 } from "tauri-plugin-m3";

interface InsetsScheme {
  adjustedInsetTop?: number;
  adjustedInsetBottom?: number;
}

export const RootComponent: React.FC = () => {
  const [insetTop, setInsetTop] = useState(0);
  const [insetBottom, setInsetBottom] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateStatusBar = (e: MediaQueryListEvent | MediaQueryList) => {
      // Dark mode → iconos claros (blancos)
      // Light mode → iconos oscuros (negros)
      M3.setBarColor(e.matches ? "light" : "dark");
    };

    const setupInsets = async () => {
      const insets = await M3.getInsets();
      if (insets && typeof insets === "object") {
        const typedInsets = insets as InsetsScheme;
        setInsetTop(typedInsets.adjustedInsetTop ?? 0);
        setInsetBottom(typedInsets.adjustedInsetBottom ?? 0);
      }
    };

    updateStatusBar(mediaQuery);
    void setupInsets();
    mediaQuery.addEventListener("change", updateStatusBar);
    return () => mediaQuery.removeEventListener("change", updateStatusBar);
  }, []);

  return (
    <body
      style={{
        paddingTop: insetTop,
        paddingBottom: insetBottom,
      } as React.CSSProperties}
    >
      {/* contenido */}
    </body>
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
- **`"dark"`** → iconos claros (blancos), fondo oscuro
- **`"light"`** → iconos oscuros (negros), fondo claro

## Problema: Contenido cortado (edge-to-edge)

Cuando usas `setBarColor()`, Android activa el modo edge-to-edge, lo que significa que el contenido se dibuja detrás de la barra de sistema. Esto puede hacer que el contenido quede oculto bajo la barra de estado.

### Solución: Obtener insets y aplicar padding

El plugin proporciona `getInsets()` para obtener los valores de compensación:

```typescript
import { useEffect, useState } from "react";
import { M3 } from "tauri-plugin-m3";

export const RootComponent: React.FC = () => {
  const [insetTop, setInsetTop] = useState(0);
  const [insetBottom, setInsetBottom] = useState(0);

  useEffect(() => {
    const setupInsets = async () => {
      const insets = await M3.getInsets();
      if (insets && typeof insets === "object") {
        setInsetTop(insets.adjustedInsetTop ?? 0);
        setInsetBottom(insets.adjustedInsetBottom ?? 0);
      }
    };

    void setupInsets();
  }, []);

  return (
    <body
      style={{
        paddingTop: insetTop,
        paddingBottom: insetBottom,
      } as React.CSSProperties}
    >
      {/* contenido */}
    </body>
  );
};
```

### Alternativa: Usar variables CSS

Si prefieres un enfoque más flexible, puedes inyectar los insets como variables CSS:

```typescript
const setupInsets = async () => {
  const insets = await M3.getInsets();
  if (insets && typeof insets === "object") {
    document.documentElement.style.setProperty(
      "--inset-top",
      `${insets.adjustedInsetTop ?? 0}px`
    );
    document.documentElement.style.setProperty(
      "--inset-bottom",
      `${insets.adjustedInsetBottom ?? 0}px`
    );
  }
};
```

Luego en tu CSS:

```css
.my-container {
  padding-top: var(--inset-top, 0px);
  padding-bottom: var(--inset-bottom, 0px);
}
```
