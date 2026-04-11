# 📕 Manual de Usuario — Administrador
## Sistema Integral de Preparación para el Saber Pro - UDC (SIPRO UDC)
### Tutor Virtual con Inteligencia Artificial

---

> [!CAUTION]
> Este manual está dirigido exclusivamente al **Administrador del sistema** SIPRO UDC. El rol de administrador tiene acceso total a la plataforma, incluyendo datos de usuarios, logs de seguridad y configuración del sistema. Maneje esta información con la máxima responsabilidad y confidencialidad.

---

## 1. Introducción

Bienvenido al módulo de administración de **SIPRO UDC — Tutor Virtual con IA**. Como Administrador del sistema, usted es el responsable de garantizar el correcto funcionamiento de la plataforma, gestionar los usuarios registrados, controlar el acceso de docentes y velar por la seguridad e integridad de los datos académicos.

Este manual le guiará en el uso de todas las funciones administrativas disponibles: desde la creación y revocación de códigos de acceso para docentes, hasta la consulta de logs de seguridad y el análisis de estadísticas globales de la plataforma.

No se necesita ser experto en sistemas para usar este panel, pero sí se requiere responsabilidad y cuidado en cada acción, ya que las decisiones que tome afectan a toda la comunidad académica que usa SIPRO UDC.

---

## 2. Objetivo del Sistema

Para el rol de Administrador, SIPRO UDC permite:

- **Gestionar usuarios**: Registrar, consultar y controlar el estado de estudiantes y docentes.
- **Controlar el acceso de docentes**: Generar, consultar y revocar códigos de registro para docentes.
- **Monitorear la seguridad**: Revisar los registros de inicio de sesión (exitosos y fallidos) con información de IP y dispositivo.
- **Consultar estadísticas globales**: Ver indicadores clave del sistema en tiempo real.
- **Administrar contenido**: Gestionar materias, competencias y configuraciones generales.
- **Enviar notificaciones institucionales**: Comunicar información relevante a la comunidad usuaria de la plataforma.

---

## 3. Acceso al Sistema

### 3.1 Requisitos previos

Para acceder como Administrador necesita:

- Conexión a internet activa.
- Un navegador web actualizado (Google Chrome, Mozilla Firefox o Microsoft Edge).
- Las credenciales de administrador asignadas por el equipo técnico de la institución.

### 3.2 Inicio de sesión como Administrador

La cuenta de administrador es creada directamente por el equipo técnico; no requiere registro público:

1. Abra su navegador y diríjase a la URL de la plataforma.
2. En la pantalla de inicio de sesión, ingrese:
   - **Correo:** `admin@siproudc.com` (o el correo asignado por TI)
   - **Contraseña:** la asignada por el equipo técnico
3. Haga clic en **"Iniciar sesión"**.
4. El sistema lo redirigirá automáticamente al **Panel de Administración** (`/admin`).

> [!CAUTION]
> Las credenciales de administrador son de uso estrictamente personal e intransferible. Nunca las comparta con terceros. Si sospecha que su contraseña ha sido comprometida, cámbiela de inmediato y notifique al equipo de TI.

**Credenciales de prueba (solo entorno de desarrollo):**

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@siproudc.com` | `Admin123!` |

> [!WARNING]
> Las credenciales de la tabla anterior son exclusivas para el **entorno de desarrollo y pruebas**. En producción, utilice las credenciales seguras asignadas por el equipo técnico institucional.

### 3.3 ¿Olvidó su contraseña?

Por motivos de seguridad, el restablecimiento de la contraseña de administrador se realiza directamente con el equipo de TI de la institución. No use el flujo de restablecimiento público.

> [!WARNING]
> La sesión se cierra automáticamente tras **5 minutos de inactividad**. Esto es especialmente importante en el rol de administrador, dado el nivel de acceso que tiene la cuenta. Asegúrese de cerrar sesión manualmente al terminar su trabajo.

---

## 4. Funcionalidades Principales

Como Administrador, dispone del control total sobre la plataforma:

| Función | Descripción |
|---|---|
| **Dashboard General** | Indicadores globales: totales de usuarios, promedio general, tasa de aprobación |
| **Gestión de Materias** | Estadísticas de las 6 competencias Saber Pro evaluadas en el sistema |
| **Gestión de Estudiantes** | Top de rendimiento y clasificación en tiempo real |
| **Gestión de Docentes** | Lista de docentes registrados con sus datos |
| **Panel de Accesos** | Generación, consulta y revocación de códigos de docentes; registro manual |
| **Logs de Seguridad** | Historial de intentos de inicio de sesión con IP y dispositivo |
| **Notificaciones** | Envío de comunicados institucionales a usuarios de la plataforma |
| **Mi Perfil** | Información personal del administrador y configuración de cuenta |

---

## 5. Paso a Paso de Uso

### 5.1 Dashboard de Administración (`/admin`)

Al iniciar sesión, llegará al **Panel de Administración**. Este panel tiene cuatro secciones principales accesibles desde el menú de pestañas:

#### Pestaña: Vista General

Es la pantalla de bienvenida del panel. Muestra los indicadores más importantes del sistema:

| Indicador | Descripción |
|---|---|
| **Total de Estudiantes** | Número de cuentas de estudiante activas en la plataforma |
| **Total de Docentes** | Número de cuentas de docente activas |
| **Promedio General** | Calificación promedio de todos los estudiantes en sus pruebas |
| **Tasa de Aprobación** | Porcentaje de estudiantes que aprueban las competencias evaluadas |

Además, encontrará tres gráficas:
- **Gráfica de Crecimiento**: Evolución del número de usuarios registrados en el tiempo.
- **Gráfica de Distribución**: Proporción de estudiantes, docentes y administradores.
- **Gráfica de Rendimiento por Área**: Comparativo visual de desempeño en las 6 competencias.

#### Pestaña: Materias

Muestra una tabla con las **6 competencias Saber Pro** evaluadas en la plataforma:

| Competencia | Datos disponibles |
|---|---|
| Matemáticas | Promedio, total aprobados, tasa de aprobación |
| Lectura Crítica | Promedio, total aprobados, tasa de aprobación |
| Ciencias Naturales | Promedio, total aprobados, tasa de aprobación |
| Razonamiento Cuantitativo | Promedio, total aprobados, tasa de aprobación |
| Inglés | Promedio, total aprobados, tasa de aprobación |
| Ciencias Sociales | Promedio, total aprobados, tasa de aprobación |

Esta sección también incluye una **gráfica de barras** con el número de estudiantes evaluados por área.

#### Pestaña: Estudiantes

Presenta el **Top 5 de estudiantes** con mejor rendimiento y la **clasificación completa** de todos los estudiantes en tiempo real:

- 🟢 **Sobresalientes**: Rendimiento alto en la mayoría de competencias.
- 🟡 **Regulares**: Rendimiento medio con áreas de mejora.
- 🔴 **En riesgo**: Rendimiento bajo, requieren atención prioritaria.

#### Pestaña: Docentes

Muestra la **tabla completa de docentes registrados** con datos extraídos directamente de la base de datos:
- Nombre completo
- Correo electrónico institucional
- Estado de la cuenta (activo/inactivo)
- Fecha de registro

---

### 5.2 Gestión de Accesos — Códigos de Docente

Esta es una de las funciones más críticas del rol de administrador. Se accede desde:

**`/admin/profile` → Pestaña "Accesos"**

#### 5.2.1 Generar un código de acceso para docente

Cuando un nuevo docente necesite registrarse en la plataforma:

1. Vaya a **Configuración** (su perfil de administrador) → pestaña **"Accesos"**.
2. En la sección **"Generar Código de Docente"**, haga clic en **"Generar Código"**.
3. El sistema creará automáticamente un código con formato `DOC-XXXXXX`.
4. El código aparecerá en la lista de códigos activos con:
   - El código generado
   - Fecha de creación
   - Fecha de expiración (8 días desde la creación)
   - Estado: **Disponible**
5. **Comparta el código** con el docente a través de un canal seguro (correo institucional).

> [!IMPORTANT]
> Cada código es de **un solo uso** y válido por **8 días**. Una vez que el docente lo utiliza para registrarse, el código queda marcado como "Consumido" y no puede reutilizarse.

#### 5.2.2 Consultar todos los códigos generados

1. En la pestaña **"Accesos"**, verá la tabla de todos los códigos generados.
2. La tabla muestra:
   - **Código**: El identificador `DOC-XXXXXX`.
   - **Estado**: Disponible / Consumido / Expirado / Revocado.
   - **Usado por**: Nombre del docente que lo utilizó (si aplica).
   - **Fecha de creación y expiración**.

#### 5.2.3 Revocar un código

Si necesita cancelar un código antes de que venza o sea usado:

1. En la tabla de códigos, ubique el código que desea revocar.
2. Haga clic en el botón **"Revocar"** o el ícono de eliminación junto al código.
3. Confirme la acción en el mensaje de verificación.
4. El código quedará marcado como **"Revocado"** y no podrá ser utilizado.

> [!CAUTION]
> La revocación de un código es irreversible. Si revoca un código que ya había compartido con un docente, este no podrá registrarse y deberá solicitarle un nuevo código.

#### 5.2.4 Registrar un docente manualmente (sin código)

Si necesita registrar a un docente directamente sin que este pase por el flujo de registro:

1. En la pestaña **"Accesos"**, busque la sección **"Registro Manual de Docente"**.
2. Complete el formulario con:
   - Nombre completo del docente
   - Correo electrónico institucional
   - Contraseña temporal
3. Haga clic en **"Registrar Docente"**.
4. El sistema crea la cuenta con rol de docente directamente en la base de datos.
5. Informe al docente sus credenciales temporales y solicítele que cambie la contraseña al primer inicio de sesión.

---

### 5.3 Logs de Seguridad

El sistema registra automáticamente cada intento de inicio de sesión en la plataforma, exitoso o fallido. Como administrador, puede consultar estos registros para monitorear la seguridad.

**Para acceder a los logs:**

1. Vaya a **Configuración** → pestaña **"Seguridad"**.
2. Verá la tabla de los **últimos 50 intentos de inicio de sesión** con la siguiente información:

| Campo | Descripción |
|---|---|
| **Correo** | Email con el que se intentó iniciar sesión |
| **Acción** | Descripción del evento (inicio de sesión exitoso, fallido, etc.) |
| **IP** | Dirección IP desde donde se realizó el intento |
| **Dispositivo** | Navegador y sistema operativo del usuario |
| **Estado** | ✅ Exitoso / ❌ Fallido |
| **Fecha y Hora** | Timestamp exacto del evento |

**Acciones disponibles:**

- **Limpiar todos los logs**: Elimina el historial de logs de la base de datos. Use esta opción con precaución y solo cuando sea necesario (por ejemplo, al inicio de un nuevo período académico).

> [!WARNING]
> La limpieza de logs es **irreversible**. Una vez eliminados, no pueden recuperarse. Solo realice esta acción si tiene autorización y justificación institucional para hacerlo.

**Cómo interpretar los logs de seguridad:**

- Múltiples intentos fallidos desde una misma IP pueden indicar un intento de acceso no autorizado.
- Accesos desde IPs o dispositivos inusuales pueden requerir verificación.
- Si detecta actividad sospechosa, notifique al equipo de TI de la institución.

---

### 5.4 Configuración del Sistema — Límites

En la pestaña **"Seguridad"** también encontrará configuraciones adicionales como:

- **Límites del sistema**: Parámetros de funcionamiento general (número máximo de intentos de login, tiempo de sesión, etc.).

> [!NOTE]
> Algunos parámetros del sistema están definidos en la configuración del servidor y solo pueden modificarse con acceso técnico al backend. Consulte con el equipo de TI si necesita cambiar estos valores.

---

### 5.5 Notificaciones Institucionales

La plataforma incluye un módulo para enviar comunicados a los usuarios registrados.

**Para enviar una notificación:**

1. Vaya a **Configuración** → pestaña **"Notificaciones"**.
2. Redacte el mensaje en el campo de texto.
3. Seleccione el público destinatario (todos los usuarios, solo estudiantes, solo docentes).
4. Haga clic en **"Enviar Notificación"**.
5. La notificación quedará registrada en el historial de la sesión actual.

> [!NOTE]
> En la versión actual, el envío de notificaciones es simulado en el frontend. Las notificaciones se registran en el historial de sesión para confirmación, pero el envío real por correo u otros canales debe configurarse con el equipo técnico.

---

### 5.6 Gestión de su Perfil de Administrador

**Acceso:**
1. Haga clic en su nombre o avatar en la esquina superior derecha.
2. Seleccione **"Mi Perfil"**.

**Pestañas disponibles:**

- **Perfil**: Actualice su información personal (nombre, datos de contacto).
- **Accesos**: Gestión de códigos de docente (vea sección 5.2).
- **Seguridad**: Logs de login y configuración de límites del sistema.
- **Notificaciones**: Envío de comunicados institucionales.

**Para cambiar su contraseña:**
1. Vaya a su Perfil → pestaña **"Perfil"** o **"Seguridad"**.
2. Ingrese su contraseña actual.
3. Escriba la nueva contraseña y confírmela.
4. Haga clic en **"Guardar cambios"**.

> [!IMPORTANT]
> Se recomienda cambiar la contraseña de administrador cada **90 días** como buena práctica de seguridad institucional.

---

## 6. Ejemplos de Uso Reales

### Ejemplo 1: Onboarding de nuevos docentes al inicio del semestre

Al iniciar el segundo semestre académico, el administrador recibe la lista de 8 nuevos docentes que usarán SIPRO UDC. Para cada uno:

1. Genera un código `DOC-XXXXXX` desde la pestaña **Accesos**.
2. Envía el código por correo institucional a cada docente con las instrucciones de registro.
3. Monitorea la tabla de códigos para confirmar que cada docente completó su registro (el código cambia a estado "Consumido").
4. Para los docentes que no completaron el registro en 8 días, genera nuevos códigos y les recuerda el proceso.

### Ejemplo 2: Investigación de acceso sospechoso

El administrador recibe un reporte de que un estudiante dice que alguien accedió a su cuenta sin autorización. Pasos a seguir:

1. Va a **Seguridad → Logs de Login**.
2. Filtra visualmente los registros por el correo del estudiante.
3. Identifica intentos de sesión desde una IP diferente a la habitual del estudiante.
4. Documenta la IP y la hora del acceso sospechoso.
5. Notifica al equipo de TI y solicita el cambio de contraseña para la cuenta afectada.

### Ejemplo 3: Reporte de rendimiento para rectoría

El decano académico solicita al administrador un informe de desempeño general de la plataforma para presentarlo en consejo académico:

1. El administrador ingresa al **Dashboard → Vista General**.
2. Registra los indicadores clave: total de usuarios, promedio general y tasa de aprobación.
3. Accede a **Materias** para identificar las competencias con menor tasa de aprobación.
4. Consulta **Estudiantes** para conocer el porcentaje de estudiantes en riesgo vs. sobresalientes.
5. Toma capturas de las gráficas y los datos para incluirlos en la presentación.

### Ejemplo 4: Registro manual de un docente con problemas de correo

El docente Pedro Gómez no puede recibir correos y no puede usar el flujo de registro con código. El administrador:

1. Va a **Accesos → Registro Manual de Docente**.
2. Ingresa el nombre y correo institucional del docente, junto con una contraseña temporal.
3. Crea la cuenta directamente.
4. Informa personalmente al docente sus credenciales y le indica que debe cambiarlas en el primer ingreso.

---

## 7. Buenas Prácticas

Para administrar SIPRO UDC de manera segura y eficiente:

1. **Genere solo los códigos necesarios**: No cree códigos de docente en anticipación excesiva. Genérelos cuando el docente esté listo para registrarse, para minimizar el riesgo de códigos no utilizados que puedan ser interceptados.

2. **Comunique los códigos por canales seguros**: Siempre envíe los códigos de docente a través del correo electrónico institucional oficial. Evite canales como WhatsApp o SMS para comunicar estas credenciales.

3. **Revise los logs de seguridad regularmente**: Mínimo una vez por semana, consulte los logs de inicio de sesión para detectar patrones inusuales o accesos no autorizados.

4. **Cambie su contraseña periódicamente**: Se recomienda cada 90 días. Use contraseñas robustas con combinación de letras, números y caracteres especiales.

5. **Cierre sesión manualmente al terminar**: Aunque el sistema cierra la sesión automáticamente a los 5 minutos, es una buena práctica hacer clic en "Cerrar sesión" antes de abandonar su puesto de trabajo.

6. **Documente los registros manuales**: Cuando registre un docente manualmente, lleve un registro interno (fuera de la plataforma) del nombre, correo y fecha de registro para auditoría institucional.

7. **No limpie los logs sin autorización**: La eliminación de logs de seguridad debe hacerse solo con aprobación institucional y siguiendo los procedimientos de auditoría establecidos.

8. **Capacite a los usuarios nuevos**: Al dar acceso a nuevos docentes o cuando los estudiantes tengan dudas, remítalos a sus manuales de usuario correspondientes para garantizar un uso correcto de la plataforma.

9. **Coordinación con el equipo técnico**: Para cambios que afecten configuraciones del servidor (variables de entorno, base de datos, integraciones), trabaje siempre en conjunto con el equipo de TI de la institución.

10. **Resguarde las credenciales del sistema**: El correo y contraseña de administrador son la llave maestra de la plataforma. Guárdelos en un gestor de contraseñas seguro y bajo su exclusivo control.

---

## 8. Preguntas Frecuentes (FAQ)

**¿Puedo crear más de una cuenta de administrador?**
En la versión actual, el sistema está diseñado para funcionar con una cuenta de administrador principal. Si necesita crear cuentas adicionales con permisos de administración, consulte con el equipo técnico de TI.

**¿Qué pasa si un docente pierde su código antes de registrarse?**
El código no puede recuperarse una vez generado (por seguridad). Deberá revocar el código anterior y generar uno nuevo para ese docente.

**¿Puedo eliminar la cuenta de un estudiante o docente?**
En la versión actual, las cuentas pueden desactivarse (campo `is_active` en la base de datos) pero no eliminarse directamente desde el panel. Para eliminar una cuenta, coordine con el equipo técnico.

**¿Los estudiantes pueden ver quién es el administrador?**
No. Los estudiantes solo tienen acceso a su propio perfil y resultados. No pueden ver la información de la cuenta de administrador ni acceder a las vistas administrativas.

**¿Por qué el dashboard muestra datos diferentes a los que veo en los logs?**
El dashboard de estadísticas usa datos extraídos directamente de la base de datos en tiempo real para usuarios reales, pero algunos indicadores de rendimiento pueden tener un componente simulado hasta que exista suficiente volumen de pruebas completadas. Para datos precisos de rendimiento, consulte los reportes de cada docente.

**¿Puedo exportar los logs de seguridad a un archivo Excel o PDF?**
En la versión actual, la exportación de datos no está habilitada directamente desde el panel. Para exportar información, coordine con el equipo técnico, quienes pueden ejecutar consultas directas a la base de datos Supabase PostgreSQL.

**¿Qué hago si el sistema no inicia o muestra un error general?**
1. Verifique que el backend (FastAPI) y el frontend (Next.js) estén correctamente activos.
2. Revise las variables de entorno en `backend/.env` y `frontend/.env.local`.
3. Consulte los logs del servidor para identificar el error específico.
4. Si el problema persiste, contacte al equipo técnico con una descripción detallada del error.

**¿Con qué frecuencia debo revisar los logs de seguridad?**
Se recomienda al menos **una revisión semanal**. En períodos de alta actividad (inicio de semestre, semanas de simulacro masivo) se recomienda revisión diaria.

---

## 9. Referencia Rápida: Rutas del Sistema

| Ruta | Descripción |
|---|---|
| `/auth/login` | Inicio de sesión para todos los roles |
| `/admin` | Dashboard principal del administrador |
| `/admin/profile` | Configuración: Accesos, Seguridad, Notificaciones |
| `/profesor` | Panel del docente |
| `/dashboard` | Panel del estudiante |

---

## 10. Soporte y Contacto

Como Administrador, es usted el primer nivel de soporte para los usuarios de la plataforma. Para problemas que requieran intervención técnica del servidor o la base de datos, contacte al equipo de TI:

| Canal | Información |
|---|---|
| **Equipo de TI Institucional** | sistemas@iudc.edu.co |
| **Área de Soporte Técnico** | Oficina de Tecnología e Innovación — Bloque A, Piso 2 |
| **Horario de atención técnica** | Lunes a viernes, 8:00 a.m. – 5:00 p.m. |
| **Teléfono** | Extensión 1234 |
| **Documentación técnica** | Consulte el archivo `README.md` del repositorio del proyecto |

**Niveles de escalamiento:**

1. **Nivel 1 (Usted — Administrador)**: Problemas de acceso de usuarios, códigos de docentes, consultas de logs.
2. **Nivel 2 (Soporte TI)**: Errores técnicos de la plataforma, problemas de conectividad con la base de datos.
3. **Nivel 3 (Equipo de Desarrollo)**: Bugs confirmados, solicitudes de nuevas funcionalidades, cambios en la arquitectura del sistema.

> [!IMPORTANT]
> Ante cualquier incidente de seguridad (acceso no autorizado, filtración de datos, comportamiento anómalo del sistema), notifique **de inmediato** al equipo de TI y al área de Seguridad de la Información institucional, independientemente del horario.

---

*Manual de Usuario — Administrador | SIPRO UDC v1.0 | Institución Universitaria DC*
*Última actualización: Abril 2026*
