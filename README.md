# hotspot-image-widget

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh hotspot-image-widget
npm run build -- --env widget=hotspot-image-widget
npm test -- src/widgets/hotspot-image-widget
scripts/release.sh hotspot-image-widget
```
