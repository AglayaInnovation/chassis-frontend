# GitHub Workflows - Chassis Frontend

Configuración de CI/CD para el monorepo Chassis Frontend.

## 🔄 Workflows Disponibles

### 1. CI (`ci.yml`)
**Trigger**: Push/PR a `main`
- ✅ Lint + Format check
- 🏗️ Build
- 🧪 Tests

### 2. Create Version PR (`changeset-version.yml`)
**Trigger**: Push a `main` con changesets
- 📦 Crea PR con versiones actualizadas
- 📝 Actualiza CHANGELOGs

### 3. Release (`release.yml`)
**Trigger**: Merge del PR de versioning
- 🚀 Publica a NPM
- 🎉 Crea GitHub Release

## 📚 Documentación Completa

Ver [CICD.md](./CICD.md) para documentación detallada sobre:
- Flujo completo de release
- Uso de changesets
- Configuración de secrets
- Ejemplos prácticos
- Troubleshooting

## 🚀 Quick Start

```bash
# 1. Hacer cambios
git checkout -b feature/my-feature

# 2. Crear changeset
yarn changeset

# 3. Commit y push
git add .
git commit -m "feat: my feature"
git push

# 4. Crear PR → CI se ejecuta
# 5. Merge → Version PR creado automáticamente
# 6. Merge Version PR → Publicación automática a NPM
```

## ⚙️ Secrets Requeridos

| Secret       | Descripción                  | Requerido Para |
| ------------ | ---------------------------- | -------------- |
| `NPM_TOKEN`  | Token de NPM para publicar   | Release        |
| `GITHUB_TOKEN` | Auto-generado por GitHub  | Todos          |

## 📊 Monitoreo

- **Actions Tab**: Ver estado de workflows
- **NPM**: [@aglaya](https://www.npmjs.com/org/aglaya)
