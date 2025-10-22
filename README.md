# ComfyUI-Daily
Channel dedicated to analysing, explaining, and testing the latest updates in the ComfyUI ecosystem. Step-by-step tutorials, performance comparisons, optimisation tips, and weekly updates to help you get the best GPU performance without breaking your setup.

# ⚙️ ComfyUI Daily

**ComfyUI Daily** (en español *ComfyUI al día*) es un proyecto abierto que acompaña al canal de YouTube [ComfyUI Daily](https://www.youtube.com/@ComfyUIaldía).  
Su objetivo es ofrecer **workflows, nodos personalizados y herramientas prácticas** para mejorar la experiencia de uso de **ComfyUI** en entornos de trabajo reales.

---

## 🧩 Contenido del repositorio

- **/workflows/** → Flujos `.json` listos para usar o adaptar.  
- **/custom_nodes/** → Nodos personalizados en Python (prefijo `CLSM_` y otros utilitarios).  
- **/scripts/** → Herramientas auxiliares y automatizaciones.  
- **/examples/** → Capturas, configuraciones o referencias de salida.  

---

## 🧠 Filosofía del proyecto

1. **Instalación limpia y modular**  
   Ningún flujo o nodo debería alterar tu entorno base. Todo debe poder instalarse, probarse y eliminarse sin romper dependencias.

2. **Código abierto y comprensible**  
   Cada nodo incluye comentarios en inglés y nombres descriptivos para facilitar su mantenimiento y aprendizaje.

3. **Transparencia total**  
   Se evita cualquier instalación automática no controlada (especialmente desde Node Manager).  
   Siempre podrás ver qué se instala, de dónde viene y qué dependencias utiliza.

---

## 🧰 Requisitos generales

- **Python 3.10–3.11**  
- **PyTorch** y **CUDA** compatibles con tu GPU (mínimo Torch 2.0).  
- **ComfyUI** versión estable o superior a `v0.3.62`  
- Entorno limpio (recomendado: entorno virtual `venv_comfyui`)

---

## 🚀 Instalación rápida

```bash
git clone https://github.com/clsard/ComfyUI-Daily.git
cd ComfyUI-Daily

