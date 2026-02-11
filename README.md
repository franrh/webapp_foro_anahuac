# 💬 Foro de Debate Interactivo con IA

**El Dilema del Silencio en Incidentes de Datos Personales**

Diplomado en Ciberseguridad • Anáhuac Online

---

## 📋 Descripción

Aplicación web que simula un foro de debate académico potenciado por IA. Los estudiantes analizan un caso de fuga de datos biométricos y debaten con "compañeros virtuales" generados por Claude, recibiendo retroalimentación formativa basada en una rúbrica de evaluación.

## ✨ Características

- 🤖 Compañeros de debate virtuales con diferentes perspectivas (técnica, legal, ética)
- 📊 Evaluación automática basada en rúbrica de 5 criterios
- 🎨 Diseño con colores institucionales de Anáhuac Online
- 📱 Responsive - funciona en móvil y escritorio
- 🔒 API key segura en el servidor (no expuesta al cliente)

---

## 🚀 Opciones de Despliegue

### Opción A: Railway (Recomendado - Más fácil)

1. **Crea cuenta en Railway**
   - Ve a [railway.app](https://railway.app) y crea una cuenta gratuita

2. **Despliega desde GitHub**
   - Sube este proyecto a un repositorio de GitHub
   - En Railway, click "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configura la variable de entorno**
   - En Railway, ve a tu proyecto → "Variables"
   - Agrega: `ANTHROPIC_API_KEY` = tu API key de Anthropic

4. **Obtén tu URL**
   - Railway genera automáticamente una URL como: `https://tu-proyecto.up.railway.app`
   - ¡Listo! Comparte esta URL con tus estudiantes

---

### Opción B: Render

1. **Crea cuenta en Render**
   - Ve a [render.com](https://render.com) y crea una cuenta

2. **Nuevo Web Service**
   - Click "New" → "Web Service"
   - Conecta tu repositorio de GitHub

3. **Configura el servicio**
   ```
   Name: foro-ia-ciberseguridad
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Agrega variable de entorno**
   - En "Environment", agrega `ANTHROPIC_API_KEY`

---

### Opción C: Vercel

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Despliega**
   ```bash
   cd webapp-foro
   vercel
   ```

3. **Configura la variable**
   - En el dashboard de Vercel → Settings → Environment Variables
   - Agrega `ANTHROPIC_API_KEY`

---

### Opción D: Servidor propio (VPS/Ubuntu)

```bash
# 1. Clona el proyecto
git clone tu-repositorio
cd webapp-foro

# 2. Instala Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instala dependencias
npm install

# 4. Configura variables de entorno
cp .env.example .env
nano .env  # Agrega tu ANTHROPIC_API_KEY

# 5. Instala PM2 para mantener el servidor corriendo
npm install -g pm2

# 6. Inicia la aplicación
pm2 start server.js --name foro-ia
pm2 save
pm2 startup

# 7. (Opcional) Configura Nginx como reverse proxy
sudo apt install nginx
```

**Configuración de Nginx** (`/etc/nginx/sites-available/foro-ia`):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔑 Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" → "Create Key"
4. Copia la key (empieza con `sk-ant-api...`)
5. Úsala en la variable `ANTHROPIC_API_KEY`

**💰 Costo estimado:** ~$0.01 - $0.03 USD por participación completa de estudiante

---

## 📁 Estructura del Proyecto

```
webapp-foro/
├── server.js          # Servidor Express con API
├── package.json       # Dependencias
├── .env.example       # Variables de entorno (ejemplo)
├── public/
│   └── index.html     # Aplicación React
└── README.md          # Este archivo
```

---

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables
cp .env.example .env
# Edita .env y agrega tu ANTHROPIC_API_KEY

# Iniciar en modo desarrollo
npm run dev

# La app estará en http://localhost:3000
```

---

## 🎓 Cómo usar en tu curso

### Opción 1: Link directo
Comparte la URL de la aplicación con tus estudiantes por:
- Anuncio en Canvas/Moodle
- Email
- WhatsApp del grupo

### Opción 2: Embed en LMS
En Canvas, crea una página y usa el código de embed:
```html
<iframe 
  src="https://tu-app.railway.app" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

### Opción 3: Redirect desde tarea
Crea una tarea en Canvas de tipo "External URL" apuntando a tu aplicación.

---

## ⚠️ Consideraciones

- **Sin autenticación**: Esta versión no requiere login. Cualquier persona con el link puede acceder.
- **Sin persistencia**: Las conversaciones no se guardan entre sesiones.
- **Límites de API**: Revisa tus límites de uso en Anthropic para evitar interrupciones.

¿Necesitas autenticación o guardar participaciones? Considera la [Opción 3: Integración LTI con Canvas].

---

## 🐛 Solución de problemas

### "Error al procesar el mensaje"
- Verifica que `ANTHROPIC_API_KEY` esté configurada correctamente
- Revisa que tengas créditos/saldo en tu cuenta de Anthropic

### La app no carga
- Verifica que el servidor esté corriendo: `curl https://tu-app.railway.app/api/health`
- Revisa los logs en Railway/Render/Vercel

### Respuestas muy lentas
- Es normal, Claude puede tomar 10-30 segundos en generar respuestas largas
- El indicador de "cargando" debería aparecer

---

## 📞 Soporte

Para preguntas sobre el contenido educativo, contacta al equipo de Anáhuac Online.

Para problemas técnicos con el despliegue, revisa la documentación de la plataforma que elegiste (Railway, Render, Vercel).

---

**Anáhuac Online** • Diplomado en Ciberseguridad • 2025
