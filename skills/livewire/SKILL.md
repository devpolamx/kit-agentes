---
name: livewire
description: Componentes Livewire 2, 3 o 4 con Blade - detectar la versión del proyecto, escribir componentes seguros y migrar de 2 a 4. Usar al crear o modificar un componente Livewire, una vista con wire:*, o al planear la migración de un proyecto Livewire 2.
metadata:
  origen: kit-agentes
  stacks: laravel-blade
---

# Livewire (2, 3 y 4)

## 1. Primero: qué versión tiene el proyecto
Lee `composer.lock` (paquete `livewire/livewire`) **antes de escribir nada**. La sintaxis cambia mucho entre versiones y el error más común es escribir código de otra versión.

| Señal en el código | Versión |
|---|---|
| Clases en `app/Http/Livewire`, `$this->emit()`, `$listeners`, `getFooProperty()`, `wire:model.defer` | 2 |
| Clases en `app/Livewire`, `$this->dispatch()`, `#[On]`, `#[Computed]`, `wire:model.live` | 3 |
| `Route::livewire()`, archivos `⚡nombre.blade.php`, namespaces `pages::` / `layouts::` | 4 |

Luego lee **solo** la referencia de esa versión:
- `references/v2.md` — mantenimiento de proyectos en Livewire 2.
- `references/v4.md` — proyectos nuevos y destino de las migraciones.
- `references/migracion-2-a-4.md` — plan de migración (pasa por los cambios de la 3; no se salta).

No mezcles sintaxis: en un proyecto Livewire 2 no uses atributos `#[...]`, `dispatch()` ni `wire:model.live`.

## 2. Reglas para cualquier versión
- **Un solo elemento raíz** por vista de componente.
- **Todo lo que llega del navegador es manipulable:** las propiedades públicas y los parámetros de las acciones se pueden alterar desde el navegador. Autoriza dentro de cada acción (`$this->authorize(...)` o una Policy), no solo al montar. En 3 y 4, `#[Locked]` en los ids que no deben cambiar; en 2, guarda el modelo (`public Post $post`) en lugar de su id suelto y vuelve a validar.
- **No guardes datos sensibles en propiedades públicas:** viajan al navegador en cada respuesta.
- **Valida siempre en el servidor** antes de guardar (`$this->validate()`), aunque la vista ya valide.
- **Dinero y varios modelos:** la lógica va en un servicio o acción, dentro de `DB::transaction`; el componente solo la llama. Un componente de más de ~400 líneas no crece.
- **`wire:key` único en cada elemento de un `@foreach`** y en componentes anidados dentro de ciclos.
- **Cada acción es una petición al servidor.** Para lo que solo es visual (abrir un menú, mostrar u ocultar), usa Alpine (`x-data`, `x-show`) en lugar de una propiedad de Livewire.
- **Pruebas:** `Livewire::test(Componente::class)->set(...)->call(...)->assert...()` en `tests/Feature`, una prueba por regla de negocio y por caso de autorización.

## 3. Si vienes de React (equivalencias)
Livewire no es React: el estado vive en el **servidor** y cada cambio es un viaje de ida y vuelta. Estas equivalencias ayudan a ubicar las ideas, no a copiar patrones.

| React | Livewire | Ojo |
|---|---|---|
| `useState` | Propiedad pública | Manipulable desde el navegador; se valida y se autoriza |
| Props | Parámetros de `mount()` o propiedades con el mismo nombre | No son reactivas: si el padre cambia, el hijo no se entera, salvo `#[Reactive]` (3 y 4) |
| `useEffect` al cambiar un valor | Hook `updatedNombre()` | Corre en el servidor después de cada cambio sincronizado |
| `useMemo` | `getNombreProperty()` (2) · `#[Computed]` (3 y 4) | Se guarda solo durante esa petición |
| Callback del hijo al padre | Eventos: `emitUp` / `emitTo` (2) · `dispatch()` (3 y 4) | Se escuchan con `$listeners` (2) o `#[On]` (3 y 4) |
| Input controlado | `wire:model` | En 2 sincroniza en cada tecla; en 3 y 4 espera a la siguiente acción (usa `.live` para cada tecla) |
| `key` en listas | `wire:key` | Igual de obligatorio |
| `React.lazy` / Suspense | Carga diferida (`wire:init` en 2; `#[Lazy]` y placeholder en 3 y 4) | |
| react-hook-form | `$rules` y `validate()` (2) · objetos `Form` (3 y 4) | |
| Estado solo del cliente | Alpine (`x-data`) o `$wire` desde Alpine | No hace viaje al servidor |
| Archivo `.tsx` con lógica y marcado | Componente de un solo archivo (4) | En 2 y 3, clase y vista van separadas |

## 4. Antes de entregar
- La sintaxis corresponde a la versión del proyecto.
- Cada acción que cambia datos autoriza y valida, y hay prueba de ambas cosas.
- `wire:key` en los ciclos; un solo elemento raíz.
- Lo puramente visual está en Alpine, no en propiedades de Livewire.
