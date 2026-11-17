# Migrar de Livewire 2 a 4

No hay guía directa de 2 a 4: se aplican **los cambios de 2→3 y luego los de 3→4**. Fuentes: https://livewire.laravel.com/docs/3.x/upgrading y https://livewire.laravel.com/docs/4.x/upgrading. Laravel Shift puede automatizar parte.

## Antes de empezar
1. **Laravel 10+ y PHP 8.1+** (requisito de la 4). Si el proyecto está en Laravel 9, primero se sube Laravel, en un cambio aparte.
2. **Red de pruebas:** cada componente que se va a tocar necesita pruebas `Livewire::test` que fijen su comportamiento actual. Sin eso, no se migra.
3. Rama propia y un brief por etapa; la suite completa al cerrar cada etapa.

## Etapa A — cambios de la 2 a la 3
| Livewire 2 | Livewire 3 y 4 |
|---|---|
| `App\Http\Livewire` | `App\Livewire` (o conservar el anterior en config) |
| Layout `resources/views/layouts/app.blade.php` | `resources/views/components/layouts/app.blade.php` en la 3; `layouts::app` en la 4 |
| Alpine cargado aparte | Viene con Livewire: **quitar** la carga manual o se carga dos veces |
| `livewire:load` (JS) | `livewire:init` |
| `wire:model` | `wire:model.live` |
| `wire:model.defer` | `wire:model` |
| `wire:model.lazy` | `wire:model.blur` |
| `@entangle(...)` / `.defer` | `@entangle(...).live` / `@entangle(...)` |
| `emit`, `emitTo`, `emitSelf`, `dispatchBrowserEvent` | `dispatch()`, `->to()`, `->self()`; parámetros con nombre |
| `emitUp` | Ya no existe: los eventos suben como eventos del navegador |
| `$listeners` | `#[On('evento')]` |
| `getFooProperty()` | `#[Computed]` |
| `$rules` + enlace a `post.title` | `#[Validate]` o un objeto `Form`; enlazar a propiedades de un modelo viene apagado (`legacy_model_binding`) |
| `$this->page` | `getPage()` / `setPage()` |
| `$this->id` | `$this->getId()` |
| `assertEmitted` | `assertDispatched` |

`php artisan livewire:upgrade` automatiza parte de esta etapa, pero no garantiza que quede completa.

## Etapa B — cambios de la 3 a la 4
- Config: `layout` → `component_layout`; `lazy_placeholder` → `component_placeholder`; nuevas `component_locations`, `component_namespaces`, `make_command` (pon `type => class` para conservar la forma) y `csp_safe`.
- Páginas completas con `Route::livewire()`.
- `wire:model` solo escucha su propio elemento (`.deep` para lo anterior); desde 4.1, `.blur` / `.change` necesitan `.live` para el comportamiento anterior.
- `wire:scroll` → `wire:navigate:scroll`; las etiquetas de componente deben cerrarse; `wire:transition` perdió sus modificadores.
- Endpoints `/livewire-{hash}/`.
- `php artisan optimize:clear` al terminar.

## Orden sugerido
1. Subir Laravel (si hace falta) con la suite en verde.
2. Pruebas de caracterización de los componentes con dinero o permisos.
3. Etapa A completa, suite en verde.
4. Etapa B, suite en verde.
5. Lo nuevo de la 4 (un solo archivo, islas) **solo** en componentes nuevos o al reescribir uno; no se convierte todo por convertir.
6. Revisar en navegador cada pantalla con formularios: el cambio de `wire:model` es el que más rompe en silencio.
