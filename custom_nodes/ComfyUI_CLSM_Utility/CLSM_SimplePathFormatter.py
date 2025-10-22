# CLSM_SimplePathFormatter.py
# Node: CLSM/Utilidades - Simple Path Formatter (with optional date prefix)

import os
from datetime import datetime

CATEGORY = "CLSM/Utilidades"
DISPLAY_NAME = "CLSM • Simple Path Formatter"


def _collapse_double_slashes(path: str) -> str:
    """Collapse duplicate forward slashes without breaking protocol or UNC prefixes."""
    if not path:
        return path

    placeholder = "__SCHEME_SLASHES__"
    tmp = path.replace("://", placeholder)

    prefix = ""
    if tmp.startswith("//"):
        prefix = "//"
        tmp = tmp[2:]

    while "//" in tmp:
        tmp = tmp.replace("//", "/")

    return f"{prefix}{tmp}".replace(placeholder, "://")


def _ensure_drive_has_sep(raw_path: str) -> str:
    """Ensure drive letters like "C:" include the trailing separator so normpath works."""
    if len(raw_path) == 2 and raw_path[1] == ":":
        return raw_path + "\\"
    return raw_path


class CLSM_SimplePathFormatter:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "win_path": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "placeholder": r'Pega aqui la ruta (p. ej. G:\\...\\export o "G:\\...\\export")'
                }),
                "file_prefix": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "placeholder": "Aniye_pruebasConQwen"
                }),
                "use_python_slashes": ("BOOLEAN", {
                    "default": True
                }),
                "date": ("BOOLEAN", {
                    "default": False
                }),
                "time": ("BOOLEAN", {
                    "default": False
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("full_prefix_path",)
    FUNCTION = "format"
    CATEGORY = CATEGORY

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        return float("nan")

    @classmethod
    def VALIDATE_INPUTS(cls, **kwargs):
        return True

    @classmethod
    def WIDTH(cls):
        return 400

    def format(self, win_path: str, file_prefix: str, use_python_slashes: bool, date: bool, time: bool):
        """Return a normalized prefix path string with optional date/time prefix."""
        raw = (win_path or "").strip().strip('"').strip("'")
        prefix = (file_prefix or "").strip()

        now = datetime.now()
        time_prefix_parts = []
        if date:
            time_prefix_parts.append(now.strftime("%Y%m%d"))
        if time:
            time_prefix_parts.append(now.strftime("%H-%M"))
        
        time_prefix = "_".join(time_prefix_parts)

        if time_prefix:
            prefix = f"{time_prefix}_{prefix}" if prefix else time_prefix

        if raw.startswith("\\\\"):
            norm = os.path.normpath(raw)
        else:
            norm = os.path.normpath(_ensure_drive_has_sep(raw)) if raw else ""

        if use_python_slashes:
            base = norm.replace("\\", "/")
            base = _collapse_double_slashes(base)
            if base and not base.endswith("/"):
                base += "/"
            full_prefix_path = f"{base}{prefix}" if prefix else base.rstrip("/")
        else:
            base = norm.replace("/", "\\")
            if base and not base.endswith("\\"):
                base += "\\"
            full_prefix_path = f"{base}{prefix}" if prefix else base.rstrip("\\")

        result = (full_prefix_path,)

        return {"ui": {"text": full_prefix_path}, "result": result}


NODE_CLASS_MAPPINGS = {"CLSM_SimplePathFormatter": CLSM_SimplePathFormatter}
NODE_DISPLAY_NAME_MAPPINGS = {"CLSM_SimplePathFormatter": DISPLAY_NAME}
