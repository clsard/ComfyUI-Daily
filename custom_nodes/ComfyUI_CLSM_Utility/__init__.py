"""Loader for ComfyUI_CLSM_Utility nodes and web assets."""

import importlib
import pkgutil
import traceback

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

# Serve browser assets from the local 'web' folder.
WEB_DIRECTORY = "web"

print("==============================================")
print("### Loading nodes from ComfyUI_CLSM_Utility ###")

for _finder, module_name, _is_pkg in pkgutil.iter_modules(__path__):
    full_module_name = f"{__name__}.{module_name}"
    try:
        module = importlib.import_module(full_module_name)

        if hasattr(module, "NODE_CLASS_MAPPINGS"):
            NODE_CLASS_MAPPINGS.update(module.NODE_CLASS_MAPPINGS)

        if hasattr(module, "NODE_DISPLAY_NAME_MAPPINGS"):
            NODE_DISPLAY_NAME_MAPPINGS.update(module.NODE_DISPLAY_NAME_MAPPINGS)

        print(f"  -> Loaded: {module_name}")
    except Exception:  # pragma: no cover - diagnostic output for ComfyUI startup
        print(f"  -> Error loading: {module_name}")
        traceback.print_exc()

print("### CLSM node loading finished. ###")
print("==============================================")

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]
