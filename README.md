# Matriz Intercompañía — Grupo VCB

Portal interno para generar la matriz de cruces de cuentas intercompañía del Grupo VCB (TREI Inmobiliaria y sociedades relacionadas).

**Producción:** proyecto Vercel [`matriz-intercompania`](https://vercel.com/sebastianmendeztrei/matriz-intercompania) · deploy automático desde `main`.

## Qué hace

- Lee en vivo los movimientos de las **9 empresas con libro propio** desde Supabase (que replica Softland).
- Permite mantener los **saldos base de las 15 empresas excluidas por posventa**, que se actualizan rara vez.
- Permite registrar **ajustes puntuales** cuando alguna de las 15 tiene movimiento.
- Genera el **Excel de la matriz** combinando las tres fuentes, con filtros fijos: comprobantes vigentes + solo norma tributaria.

## Fuentes de datos

| Fuente | Qué aporta | Frecuencia |
|---|---|---|
| Supabase · proyecto `Contabilidad - Finanzas` · schema `grupo` | Movimientos en vivo de las 9 empresas | Sincronización automática desde Softland |
| Tabla editable `saldos_base_excluidas` | Saldos al 30-jun-2026 de las 15 empresas de posventa | Carga única, mantiene Carolina |
| Tabla editable `ajustes_excluidas` | Movimientos puntuales de las 15 entre corte y corte | Se agregan solo cuando ocurren |

## Decisiones contables confirmadas

- **Estados de comprobante P y N:** se excluyen. Solo cuentan vigentes (`cpbest = 'V'`).
- **Norma contable:** solo tributaria (`cpbnormatrib = 'S'`). La base convertirá a IFRS automáticamente cuando se haga el traspaso.
- **Identificación de contrapartes:** por RUT en `grupo.auxiliares` cruzado contra `grupo.empresas`.

## Pendientes de contabilidad (Carolina)

- [ ] Confirmar la lista definitiva de 15 empresas excluidas por posventa.
- [ ] Subir sus saldos al 30-jun-2026 como punto de partida.
- [ ] Resolver el descuadre histórico Q12 vs VCB Inversiones (~$634 MM reportado en junio).
- [ ] Definir regla para líneas sin auxiliar en cuentas de relacionadas.

## Stack

- HTML + CSS + JS vanilla (sin build step)
- Despliegue en Vercel (static + 1 Serverless Function en `/api/config`)
- Fuente de datos: Supabase (proyecto `Contabilidad - Finanzas`)

## Variables de entorno (Vercel)

El cliente de Supabase se inicializa leyendo `/api/config`, que a su vez
lee variables de entorno. Antes del primer deploy, en Vercel → Settings →
Environment Variables agregar:

| Variable | Valor | Scopes |
|---|---|---|
| `SUPABASE_URL` | `https://xdislftwnamrlqqxybtm.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | publishable key del proyecto (Supabase → Settings → API) | Production, Preview, Development |

Después de agregarlas, hacer un redeploy desde Vercel (o un push) para que
tomen efecto.

## Whitelist de edición

Las ediciones (saldos base y ajustes) pasan por RPCs SECURITY DEFINER que
validan `auth.jwt() ->> 'email'` contra una whitelist en la función
`public.mi_puede_editar()`. Para agregar un correo:

```sql
create or replace function public.mi_puede_editar()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt() ->> 'email') in (
    'sebastianmendezveas@gmail.com',
    'smendez@trei.cl'
    -- agregar aquí
  ), false);
$$;
```

## Marca

Sigue el Manual de Marca del Informe Comercial de Trei: tipografía Ubuntu, rojo Trei `#E1093F` como acento, negro Trei `#111` para estructura, section-titles en mayúscula con tracking, tabla con header negro, botón CTA rojo.
