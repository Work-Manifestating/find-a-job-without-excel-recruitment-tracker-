#!/usr/bin/env python3
"""Install or remove the Job Tracker macOS LaunchAgent."""

from __future__ import annotations

import argparse
import os
import plistlib
import subprocess
import sys
from pathlib import Path


LABEL = "com.jobtracker.local"
PLIST_PATH = Path.home() / "Library" / "LaunchAgents" / f"{LABEL}.plist"


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def plist_payload(root: Path) -> dict:
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    return {
        "Label": LABEL,
        "ProgramArguments": [sys.executable, str(root / "server.py")],
        "WorkingDirectory": str(root),
        "RunAtLoad": True,
        "KeepAlive": True,
        "ProcessType": "Interactive",
        "StandardOutPath": str(data_dir / "launchagent.log"),
        "StandardErrorPath": str(data_dir / "launchagent.error.log"),
        "EnvironmentVariables": {
            "PYTHONUNBUFFERED": "1",
        },
    }


def unload() -> None:
    subprocess.run(
        ["launchctl", "bootout", f"gui/{os.getuid()}", str(PLIST_PATH)],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def install() -> None:
    root = project_root()
    PLIST_PATH.parent.mkdir(parents=True, exist_ok=True)
    unload()
    with PLIST_PATH.open("wb") as handle:
        plistlib.dump(plist_payload(root), handle, sort_keys=False)
    result = subprocess.run(
        ["launchctl", "bootstrap", f"gui/{os.getuid()}", str(PLIST_PATH)],
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        PLIST_PATH.unlink(missing_ok=True)
        raise SystemExit(result.stderr.strip() or "Could not start the LaunchAgent.")
    subprocess.run(["launchctl", "kickstart", "-k", f"gui/{os.getuid()}/{LABEL}"], check=False)
    print("Job Tracker will now start automatically when you log in.")
    print("Dashboard: http://127.0.0.1:8765")
    print(f"LaunchAgent: {PLIST_PATH}")


def remove() -> None:
    unload()
    if PLIST_PATH.exists():
        PLIST_PATH.unlink()
        print(f"Removed {PLIST_PATH}")
    else:
        print("Job Tracker autostart was not installed.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage Job Tracker macOS autostart.")
    parser.add_argument("--remove", action="store_true", help="Remove the autostart service.")
    args = parser.parse_args()
    if sys.platform != "darwin":
        raise SystemExit("This installer is for macOS only.")
    if args.remove:
        remove()
    else:
        install()


if __name__ == "__main__":
    main()
