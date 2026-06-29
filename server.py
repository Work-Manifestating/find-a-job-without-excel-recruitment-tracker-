from __future__ import annotations

import json
import mimetypes
import re
import shutil
import sqlite3
import sys
import base64
import binascii
import zipfile
import zlib
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
JOBS_DIR = DATA_DIR / "jobs"
RESUMES_DIR = DATA_DIR / "resumes"
DB_PATH = DATA_DIR / "tracker.db"
WEB_DIR = ROOT / "web"

DEFAULT_STAGE = "SAVED"
DEFAULT_STATUS = "SAVED"
KNOWN_STAGES = {"SAVED", "APPLIED", "ASSESSMENT", "INTERVIEW", "ARCHIVED"}
SAVED_TO_APPLIED_STATUS = "SAVED_TO_APPLIED"
SAVED_NOT_APPLY_STATUS = "SAVED_NOT_APPLY"
APPLIED_WAITING_STATUS = "APPLIED_SUCCESS"
APPLIED_STALE_STATUS = "APPLIED_STALE"
ASSESSMENT_INVITED_STATUS = "ASSESSMENT_INVITED"
ASSESSMENT_COMPLETED_STATUS = "ASSESSMENT_COMPLETED"
ASSESSMENT_NEXT_ROUND_STATUS = "ASSESSMENT_NEXT_ROUND"
ASSESSMENT_REJECTED_STATUS = "ASSESSMENT_REJECTED"
INTERVIEW_INVITED_STATUS = "INTERVIEW_INVITED"
INTERVIEW_COMPLETED_STATUS = "INTERVIEW_COMPLETED"
INTERVIEW_NEXT_ROUND_STATUS = "INTERVIEW_NEXT_ROUND"
INTERVIEW_FINAL_STATUS = "INTERVIEW_FINAL"
INTERVIEW_REJECTED_STATUS = "INTERVIEW_REJECTED"
INTERVIEW_OFFER_STATUS = "OFFER"
ALLOWED_RESUME_TYPES = {".pdf", ".docx", ".doc", ".txt"}
DEFAULT_JOB_TYPE = "FULL_TIME"
KNOWN_JOB_TYPES = {"PART_TIME", "FULL_TIME", "INTERNSHIP"}
DEFAULT_NEXT_ACTION = "DECIDE"
KNOWN_NEXT_ACTIONS = {
    "DECIDE",
    "APPLY",
    "WAIT",
    "FOLLOW_UP",
    "PREPARE",
    "COMPLETE_TASK",
    "ARCHIVE",
}


def normalize_status(value: str | None) -> str:
    status = (value or DEFAULT_STATUS).strip()
    if not status:
        return DEFAULT_STATUS
    if len(status) > 80:
        raise ValueError("Status is too long")
    return status


def normalize_stage(value: str | None) -> str:
    stage = (value or DEFAULT_STAGE).strip()
    if stage not in KNOWN_STAGES:
        raise ValueError("Invalid stage")
    return stage


def normalize_stage_status(stage: str, status: str | None) -> str:
    if stage == "SAVED" and status not in {SAVED_TO_APPLIED_STATUS, SAVED_NOT_APPLY_STATUS}:
        return "SAVED"
    if stage == "ARCHIVED":
        return status or "ARCHIVED"
    return normalize_status(status)


def stage_for_status(status: str) -> str | None:
    if status == "SAVED":
        return "SAVED"
    if status == SAVED_TO_APPLIED_STATUS:
        return "APPLIED"
    if status == SAVED_NOT_APPLY_STATUS:
        return "ARCHIVED"
    if status in {"APPLIED_SUCCESS", "APPLIED_STALE", "APPLIED_REJECTED"}:
        return "APPLIED"
    if status in {
        "ASSESSMENT_PENDING",
        "OA",
        "VI",
        "TECH_TEST",
        ASSESSMENT_INVITED_STATUS,
        ASSESSMENT_COMPLETED_STATUS,
        ASSESSMENT_NEXT_ROUND_STATUS,
        ASSESSMENT_REJECTED_STATUS,
    }:
        return "ASSESSMENT"
    if status in {
        "INTERVIEW_1",
        "INTERVIEW_2",
        INTERVIEW_INVITED_STATUS,
        INTERVIEW_COMPLETED_STATUS,
        INTERVIEW_NEXT_ROUND_STATUS,
        INTERVIEW_FINAL_STATUS,
        INTERVIEW_REJECTED_STATUS,
        INTERVIEW_OFFER_STATUS,
    }:
        return "INTERVIEW"
    if status == "ARCHIVED":
        return "ARCHIVED"
    return None


def default_next_action(stage: str, status: str) -> str:
    if stage == "ARCHIVED" or status in {SAVED_NOT_APPLY_STATUS, "ARCHIVED"}:
        return "ARCHIVE"
    if status.endswith("_REJECTED"):
        return "ARCHIVE"
    if stage == "SAVED":
        return "DECIDE"
    if stage == "APPLIED":
        return "WAIT"
    if stage in {"ASSESSMENT", "INTERVIEW"}:
        return "PREPARE"
    return DEFAULT_NEXT_ACTION


def should_default_next_action(current_action: str | None, stage: str, status: str) -> bool:
    if not current_action:
        return True
    return current_action == default_next_action(stage, status)


def normalize_job_type(value: str | None) -> str:
    job_type = (value or DEFAULT_JOB_TYPE).strip()
    if job_type not in KNOWN_JOB_TYPES:
        raise ValueError("Invalid job type")
    return job_type


def normalize_next_action(value: str | None) -> str:
    action = (value or DEFAULT_NEXT_ACTION).strip()
    if action not in KNOWN_NEXT_ACTIONS:
        raise ValueError("Invalid next action")
    return action


def apply_transition_status(stage: str, status: str) -> tuple[str, str]:
    if status == SAVED_TO_APPLIED_STATUS:
        return "APPLIED", APPLIED_WAITING_STATUS
    if status == SAVED_NOT_APPLY_STATUS:
        return "ARCHIVED", "ARCHIVED"
    return stage, status


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "job"


def safe_json_loads(value: str | None, fallback: object) -> object:
    if not value:
        return fallback
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return fallback


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    RESUMES_DIR.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS job_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT NOT NULL,
                position_name TEXT NOT NULL,
                job_type TEXT NOT NULL DEFAULT 'FULL_TIME',
                company_category TEXT NOT NULL DEFAULT '',
                department_name TEXT NOT NULL DEFAULT '',
                office_location TEXT NOT NULL DEFAULT '',
                commute_requirement TEXT NOT NULL DEFAULT '',
                source_url TEXT,
                apply_url TEXT,
                requirements TEXT NOT NULL DEFAULT '',
                visa_sponsorship TEXT NOT NULL DEFAULT '',
                salary_range TEXT NOT NULL DEFAULT '',
                rotation_preference TEXT NOT NULL DEFAULT '',
                application_limit TEXT NOT NULL DEFAULT '',
                duplicate_check TEXT NOT NULL DEFAULT '',
                interview_process TEXT NOT NULL DEFAULT '',
                notes TEXT NOT NULL DEFAULT '',
                jd_local_path TEXT,
                html_local_path TEXT,
                screenshot_local_path TEXT,
                apply_time TEXT,
                deadline TEXT NOT NULL DEFAULT '',
                current_stage TEXT NOT NULL DEFAULT 'SAVED',
                status TEXT NOT NULL DEFAULT 'SAVED',
                next_action TEXT NOT NULL DEFAULT 'DECIDE',
                latest_email_id INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS timeline_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_application_id INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                event_title TEXT NOT NULL,
                event_time TEXT NOT NULL,
                source TEXT NOT NULL DEFAULT 'manual',
                notes TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (job_application_id)
                    REFERENCES job_applications(id)
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS email_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_application_id INTEGER,
                provider TEXT,
                provider_message_id TEXT,
                sender TEXT,
                subject TEXT,
                received_at TEXT,
                email_type TEXT,
                raw_content TEXT,
                is_read INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                FOREIGN KEY (job_application_id)
                    REFERENCES job_applications(id)
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS resume_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                tags TEXT NOT NULL DEFAULT '[]',
                file_name TEXT NOT NULL,
                file_type TEXT NOT NULL,
                file_local_path TEXT NOT NULL,
                extracted_text TEXT,
                parsed_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                fields_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS question_bank (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'general',
                tags TEXT NOT NULL DEFAULT '[]',
                answers_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS interview_stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                situation TEXT NOT NULL DEFAULT '',
                task TEXT NOT NULL DEFAULT '',
                action TEXT NOT NULL DEFAULT '',
                result TEXT NOT NULL DEFAULT '',
                tags TEXT NOT NULL DEFAULT '[]',
                notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS company_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT NOT NULL,
                industry TEXT NOT NULL DEFAULT '',
                overview TEXT NOT NULL DEFAULT '',
                culture TEXT NOT NULL DEFAULT '',
                why_interested TEXT NOT NULL DEFAULT '',
                interview_focus TEXT NOT NULL DEFAULT '',
                notes TEXT NOT NULL DEFAULT '',
                tags TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS interview_prep (
                job_application_id INTEGER NOT NULL,
                item_type TEXT NOT NULL,
                item_id INTEGER NOT NULL,
                is_ready INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (job_application_id, item_type, item_id),
                FOREIGN KEY (job_application_id)
                    REFERENCES job_applications(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_jobs_status
                ON job_applications(status);
            CREATE INDEX IF NOT EXISTS idx_timeline_job
                ON timeline_events(job_application_id);
            CREATE INDEX IF NOT EXISTS idx_resume_profiles_name
                ON resume_profiles(name);
            """
        )
        columns = {
            row["name"]
            for row in conn.execute("PRAGMA table_info(job_applications)").fetchall()
        }
        if "job_type" not in columns:
            conn.execute(
                "ALTER TABLE job_applications ADD COLUMN job_type TEXT NOT NULL DEFAULT 'FULL_TIME'"
            )
        if "next_action" not in columns:
            conn.execute(
                "ALTER TABLE job_applications ADD COLUMN next_action TEXT NOT NULL DEFAULT 'DECIDE'"
            )
        optional_columns = {
            "company_category": "TEXT NOT NULL DEFAULT ''",
            "department_name": "TEXT NOT NULL DEFAULT ''",
            "office_location": "TEXT NOT NULL DEFAULT ''",
            "commute_requirement": "TEXT NOT NULL DEFAULT ''",
            "requirements": "TEXT NOT NULL DEFAULT ''",
            "visa_sponsorship": "TEXT NOT NULL DEFAULT ''",
            "salary_range": "TEXT NOT NULL DEFAULT ''",
            "rotation_preference": "TEXT NOT NULL DEFAULT ''",
            "application_limit": "TEXT NOT NULL DEFAULT ''",
            "duplicate_check": "TEXT NOT NULL DEFAULT ''",
            "interview_process": "TEXT NOT NULL DEFAULT ''",
            "notes": "TEXT NOT NULL DEFAULT ''",
            "assessment_round": "INTEGER NOT NULL DEFAULT 1",
            "interview_round": "INTEGER NOT NULL DEFAULT 1",
            "deadline": "TEXT NOT NULL DEFAULT ''",
        }
        for column, definition in optional_columns.items():
            if column not in columns:
                conn.execute(f"ALTER TABLE job_applications ADD COLUMN {column} {definition}")
        now = utc_now()
        conn.execute(
            """
            INSERT OR IGNORE INTO user_profile (id, fields_json, created_at, updated_at)
            VALUES (1, '{}', ?, ?)
            """,
            (now, now),
        )
        conn.execute(
            """
            UPDATE job_applications
            SET status = 'APPLIED_SUCCESS',
                current_stage = 'APPLIED'
            WHERE status IN ('DISCOVERED', 'APPLIED')
            """
        )
        conn.execute(
            """
            UPDATE job_applications
            SET status = 'SAVED'
            WHERE current_stage = 'SAVED'
              AND status NOT IN ('SAVED_TO_APPLIED', 'SAVED_NOT_APPLY')
            """
        )
        conn.execute(
            """
            UPDATE job_applications
            SET current_stage = 'ARCHIVED',
                next_action = 'ARCHIVE'
            WHERE status = 'SAVED_NOT_APPLY'
            """
        )
        conn.execute(
            """
            UPDATE job_applications
            SET status = 'ASSESSMENT_INVITED',
                current_stage = 'ASSESSMENT'
            WHERE status IN ('OA_PENDING', 'ASSESSMENT_PENDING', 'OA', 'VI', 'TECH_TEST')
            """
        )
        conn.execute(
            """
            UPDATE job_applications
            SET status = 'ASSESSMENT_COMPLETED',
                current_stage = 'ASSESSMENT'
            WHERE status = 'OA_COMPLETED'
            """
        )
        conn.execute(
            """
            UPDATE job_applications
            SET status = 'INTERVIEW_INVITED',
                current_stage = 'INTERVIEW'
            WHERE status IN ('INTERVIEW', 'INTERVIEW_PENDING', 'INTERVIEW_1', 'INTERVIEW_2')
            """
        )
        mark_stale_applications(conn)


def parse_db_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    text = value.strip()
    if not text:
        return None
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        try:
            parsed = datetime.fromisoformat(f"{text}T00:00:00+00:00")
        except ValueError:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def mark_stale_applications(conn: sqlite3.Connection) -> None:
    threshold = datetime.now(timezone.utc) - timedelta(days=35)
    rows = conn.execute(
        """
        SELECT id, apply_time, created_at
        FROM job_applications
        WHERE current_stage = 'APPLIED'
          AND status = 'APPLIED_SUCCESS'
        """
    ).fetchall()
    stale_ids = []
    for row in rows:
        applied_at = parse_db_datetime(row["apply_time"]) or parse_db_datetime(row["created_at"])
        if applied_at and applied_at <= threshold:
            stale_ids.append(row["id"])
    if stale_ids:
        now = utc_now()
        conn.executemany(
            """
            UPDATE job_applications
            SET status = 'APPLIED_STALE',
                updated_at = ?
            WHERE id = ?
            """,
            [(now, job_id) for job_id in stale_ids],
        )


def row_to_dict(row: sqlite3.Row) -> dict:
    return {key: row[key] for key in row.keys()}


def resume_row_to_dict(row: sqlite3.Row) -> dict:
    data = row_to_dict(row)
    data["tags"] = safe_json_loads(data.get("tags"), [])
    data["parsed_json"] = safe_json_loads(data.get("parsed_json"), {})
    return data


def question_row_to_dict(row: sqlite3.Row) -> dict:
    data = row_to_dict(row)
    data["tags"] = safe_json_loads(data.get("tags"), [])
    data["answers"] = safe_json_loads(data.get("answers_json"), [])
    del data["answers_json"]
    return data


def story_row_to_dict(row: sqlite3.Row) -> dict:
    data = row_to_dict(row)
    data["tags"] = safe_json_loads(data.get("tags"), [])
    return data


def company_note_row_to_dict(row: sqlite3.Row) -> dict:
    data = row_to_dict(row)
    data["tags"] = safe_json_loads(data.get("tags"), [])
    return data


SHARED_PROFILE_KEYS = (
    "full_name",
    "first_name",
    "last_name",
    "phone",
    "age",
    "date_of_birth",
    "location",
    "address",
    "city",
    "postcode",
    "country",
    "visa_status",
    "needs_sponsorship",
    "right_to_work",
    "my_skills",
)


RESUME_PROFILE_KEYS = (
    "email",
    "linkedin",
    "github",
    "portfolio",
)


def get_user_profile_fields(conn: sqlite3.Connection) -> dict:
    row = conn.execute("SELECT fields_json FROM user_profile WHERE id = 1").fetchone()
    if not row:
        return {}
    data = safe_json_loads(row["fields_json"], {})
    return data if isinstance(data, dict) else {}


def clean_profile_fields(payload: dict, keys: tuple[str, ...]) -> dict:
    return {key: str(payload.get(key) or "").strip() for key in keys if key in payload}


def clean_user_profile_updates(payload: dict) -> dict:
    updates = clean_profile_fields(payload, SHARED_PROFILE_KEYS)
    for key, value in payload.items():
        if re.fullmatch(r"week_note_\d{4}_\d{2}", key) or re.fullmatch(r"review_note_\d{4}-\d{2}-\d{2}", key):
            updates[key] = str(value or "").strip()
    return updates


def normalize_tags(value: object) -> list[str]:
    if isinstance(value, str):
        parts = re.split(r"[,，\n]+", value)
    elif isinstance(value, list):
        parts = [str(item) for item in value]
    else:
        parts = []
    tags = []
    seen = set()
    for part in parts:
        tag = part.strip()
        key = tag.lower()
        if tag and key not in seen:
            tags.append(tag[:40])
            seen.add(key)
    return tags[:12]


def extract_docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        xml_body = archive.read("word/document.xml")
    root = ET.fromstring(xml_body)
    namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs = []
    for paragraph in root.findall(".//w:p", namespace):
        text = "".join(node.text or "" for node in paragraph.findall(".//w:t", namespace))
        if text.strip():
            paragraphs.append(text.strip())
    return "\n".join(paragraphs)


def extract_pdf_text_with_pdfplumber(path: Path) -> str:
    try:
        import pdfplumber  # type: ignore
    except ImportError:
        return ""

    pages = []
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text(x_tolerance=1, y_tolerance=3) or ""
                if text.strip():
                    pages.append(text.strip())
    except Exception:
        return ""
    return "\n\n".join(pages).strip()


def extract_pdf_text_with_pypdf(path: Path) -> str:
    try:
        from pypdf import PdfReader  # type: ignore
    except ImportError:
        return ""

    pages = []
    try:
        reader = PdfReader(str(path))
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text.strip())
    except Exception:
        return ""
    return "\n\n".join(pages).strip()


def extract_pdf_text_fallback(path: Path) -> str:
    raw = path.read_bytes()
    chunks = []
    for stream_match in re.finditer(rb"stream\r?\n(.*?)\r?\nendstream", raw, flags=re.S):
        stream = stream_match.group(1)
        prefix = raw[max(0, stream_match.start() - 240):stream_match.start()]
        if b"FlateDecode" in prefix:
            try:
                stream = zlib.decompress(stream)
            except zlib.error:
                pass
        chunks.append(stream.decode("latin-1", errors="ignore"))
    chunks.append(raw.decode("latin-1", errors="ignore"))
    text = "\n".join(chunks)
    chunks = []
    for match in re.finditer(r"\((.*?)\)\s*Tj", text, flags=re.S):
        chunks.append(match.group(1))
    for match in re.finditer(r"\[(.*?)\]\s*TJ", text, flags=re.S):
        chunks.extend(re.findall(r"\((.*?)\)", match.group(1), flags=re.S))
    if not chunks:
        chunks = re.findall(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}|https?://[^\s<>()]+|[A-Za-z][A-Za-z0-9 ,.'@:/+\-]{8,}", text)
    cleaned = "\n".join(chunk.replace(r"\(", "(").replace(r"\)", ")") for chunk in chunks)
    return re.sub(r"\s+\n", "\n", cleaned).strip()


def extract_pdf_text(path: Path) -> str:
    best_text = ""
    for extractor in (
        extract_pdf_text_with_pdfplumber,
        extract_pdf_text_with_pypdf,
        extract_pdf_text_fallback,
    ):
        text = extractor(path)
        clean_text = text.strip()
        if len(clean_text) > len(best_text):
            best_text = clean_text
        if len(clean_text) >= 80:
            return clean_text
    return best_text


def extract_binary_text(path: Path) -> str:
    text = path.read_bytes().decode("latin-1", errors="ignore")
    chunks = re.findall(
        r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}|https?://[^\s<>()]+|[A-Za-z][A-Za-z0-9 ,.'@:/+\-]{8,}",
        text,
    )
    return "\n".join(chunk.strip() for chunk in chunks if chunk.strip())


def extract_resume_text(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".docx":
        return extract_docx_text(path)
    if suffix == ".pdf":
        return extract_pdf_text(path)
    if suffix == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore")
    if suffix == ".doc":
        return extract_binary_text(path)
    return ""


def infer_resume_fields(text: str, payload: dict | None = None) -> dict:
    payload = payload or {}
    email_matches = re.findall(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", text)
    email_guess = max(email_matches, key=len) if email_matches else ""
    phone_match = re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", text)
    linkedin_match = re.search(r"https?://(?:www\.)?linkedin\.com/[^\s)>\]]+", text, re.I)
    github_match = re.search(r"https?://(?:www\.)?github\.com/[^\s)>\]]+", text, re.I)
    portfolio_match = re.search(r"https?://(?!.*(?:linkedin|github)\.com)[^\s)>\]]+", text, re.I)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    name_guess = ""
    for line in lines[:8]:
        if "@" in line or len(line) > 70:
            continue
        if re.fullmatch(r"[A-Za-z][A-Za-z .'-]{2,}|[\u4e00-\u9fff]{2,8}", line):
            name_guess = line
            break
    fields = {
        "full_name": payload.get("full_name", "").strip() or name_guess,
        "email": payload.get("email", "").strip() or email_guess,
        "phone": payload.get("phone", "").strip() or (phone_match.group(0).strip() if phone_match else ""),
        "location": payload.get("location", "").strip(),
        "linkedin": payload.get("linkedin", "").strip() or (linkedin_match.group(0) if linkedin_match else ""),
        "github": payload.get("github", "").strip() or (github_match.group(0) if github_match else ""),
        "portfolio": payload.get("portfolio", "").strip() or (portfolio_match.group(0) if portfolio_match else ""),
    }
    if fields["full_name"]:
        parts = fields["full_name"].split()
        fields["first_name"] = payload.get("first_name", "").strip() or parts[0]
        fields["last_name"] = payload.get("last_name", "").strip() or (" ".join(parts[1:]) if len(parts) > 1 else "")
    else:
        fields["first_name"] = payload.get("first_name", "").strip()
        fields["last_name"] = payload.get("last_name", "").strip()
    return fields


def split_resume_and_shared_fields(fields: dict) -> tuple[dict, dict]:
    resume_fields = {key: fields.get(key, "") for key in RESUME_PROFILE_KEYS if fields.get(key)}
    shared_fields = {key: fields.get(key, "") for key in SHARED_PROFILE_KEYS if fields.get(key)}
    return resume_fields, shared_fields


def save_resume_file(payload: dict) -> tuple[str, str, str]:
    file_name = Path(payload.get("file_name", "")).name
    suffix = Path(file_name).suffix.lower()
    if suffix not in ALLOWED_RESUME_TYPES:
        raise ValueError("Resume file must be PDF, DOCX, DOC, or TXT")
    raw_base64 = payload.get("file_content_base64", "")
    if "," in raw_base64:
        raw_base64 = raw_base64.split(",", 1)[1]
    try:
        content = base64.b64decode(raw_base64, validate=True)
    except (binascii.Error, ValueError) as error:
        raise ValueError("Invalid resume file content") from error
    if not content:
        raise ValueError("Resume file is empty")
    if len(content) > 8 * 1024 * 1024:
        raise ValueError("Resume file must be smaller than 8 MB")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder = RESUMES_DIR / f"{slugify(payload.get('name', 'resume'))}_{timestamp}"
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / f"resume{suffix}"
    target.write_bytes(content)
    return file_name, suffix.lstrip("."), str(target.relative_to(ROOT))


def markdown_for_job(payload: dict) -> str:
    company = payload.get("company_name", "").strip()
    position = payload.get("position_name", "").strip()
    job_type = normalize_job_type(payload.get("job_type"))
    stage = normalize_stage(payload.get("current_stage"))
    status = normalize_status(payload.get("status"))
    source_url = payload.get("source_url", "").strip()
    apply_url = payload.get("apply_url", "").strip()
    requirements = payload.get("requirements", "").strip()
    notes = payload.get("notes", "").strip()
    jd_content = payload.get("jd_content", "").strip()

    return "\n".join(
        [
            "---",
            f"company: {company}",
            f"position: {position}",
            f"job_type: {job_type}",
            f"status: {status}",
            f"stage: {stage}",
            f"source_url: {source_url}",
            f"apply_url: {apply_url}",
            f"company_category: {payload.get('company_category', '').strip()}",
            f"department: {payload.get('department_name', '').strip()}",
            f"office_location: {payload.get('office_location', '').strip()}",
            f"visa_sponsorship: {payload.get('visa_sponsorship', '').strip()}",
            "---",
            "",
            f"# {company} - {position}",
            "",
            "## Links",
            "",
            f"- Source: {source_url or 'N/A'}",
            f"- Apply: {apply_url or 'N/A'}",
            "",
            "## Tracking Notes",
            "",
            f"- Company type: {payload.get('company_category', '').strip() or 'N/A'}",
            f"- Department: {payload.get('department_name', '').strip() or 'N/A'}",
            f"- Office / commute: {payload.get('office_location', '').strip() or 'N/A'} / {payload.get('commute_requirement', '').strip() or 'N/A'}",
            f"- Visa sponsorship: {payload.get('visa_sponsorship', '').strip() or 'N/A'}",
            f"- Salary range: {payload.get('salary_range', '').strip() or 'N/A'}",
            f"- Rotation preference: {payload.get('rotation_preference', '').strip() or 'N/A'}",
            f"- Application limit: {payload.get('application_limit', '').strip() or 'N/A'}",
            f"- Duplicate account check: {payload.get('duplicate_check', '').strip() or 'N/A'}",
            f"- Interview process: {payload.get('interview_process', '').strip() or 'N/A'}",
            f"- Notes: {notes or 'N/A'}",
            "",
            "## Requirements",
            "",
            requirements or "_No requirements saved yet._",
            "",
            "## Job Description",
            "",
            jd_content or "_No JD content saved yet._",
            "",
        ]
    )


def save_job_files(payload: dict) -> tuple[str, str]:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = "_".join(
        [
            slugify(payload.get("company_name", "")),
            slugify(payload.get("position_name", "")),
            timestamp,
        ]
    )
    job_dir = JOBS_DIR / folder_name
    job_dir.mkdir(parents=True, exist_ok=True)

    md_path = job_dir / "jd.md"
    html_path = job_dir / "jd.html"
    md_path.write_text(markdown_for_job(payload), encoding="utf-8")
    html_path.write_text(
        payload.get("html_content") or "<!doctype html><title>JD backup</title>",
        encoding="utf-8",
    )
    return str(md_path.relative_to(ROOT)), str(html_path.relative_to(ROOT))


def job_matches_search(job: dict, search: str) -> bool:
    if not search:
        return True
    haystack = " ".join(
        str(job.get(key) or "")
        for key in (
            "company_name", "position_name", "job_type", "company_category",
            "department_name", "office_location", "commute_requirement",
            "source_url", "apply_url", "requirements", "visa_sponsorship",
            "salary_range", "rotation_preference", "application_limit",
            "duplicate_check", "interview_process", "notes",
        )
    ).lower()
    needle = search.lower()
    if needle in haystack:
        return True
    jd_path = job.get("jd_local_path")
    if not jd_path:
        return False
    target = (ROOT / jd_path).resolve()
    if not str(target).startswith(str(JOBS_DIR.resolve())) or not target.exists():
        return False
    return needle in target.read_text(encoding="utf-8", errors="ignore").lower()


class Handler(BaseHTTPRequestHandler):
    server_version = "JobTrackerMVP/0.1"

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, message: str, status: int = 400) -> None:
        self.send_json({"error": message}, status)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/jobs":
            self.list_jobs(parse_qs(parsed.query))
            return
        if path == "/api/resume-profiles":
            self.list_resume_profiles()
            return
        if path == "/api/user-profile":
            self.get_user_profile()
            return
        if path.startswith("/api/resume-profiles/"):
            parts = path.strip("/").split("/")
            if len(parts) == 3 and parts[2].isdigit():
                self.get_resume_profile(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "file":
                self.serve_resume_file(int(parts[2]))
                return
        if path.startswith("/api/jobs/"):
            parts = path.strip("/").split("/")
            if len(parts) == 3 and parts[2].isdigit():
                self.get_job(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "timeline":
                self.list_timeline(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "jd":
                self.serve_jd(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "html":
                self.serve_saved_html(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "prep":
                self.get_job_prep(int(parts[2]))
                return

        if path == "/api/weekly-review":
            self.get_weekly_review()
            return
        if path == "/api/calendar-day":
            self.get_calendar_day(parse_qs(parsed.query))
            return
        if path == "/api/question-bank":
            self.list_question_bank()
            return
        if path == "/api/interview-stories":
            self.list_interview_stories()
            return
        if path == "/api/company-notes":
            self.list_company_notes()
            return

        self.serve_static(path)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path == "/api/jobs":
            self.create_job()
            return
        if path == "/api/resume-profiles":
            self.create_resume_profile()
            return
        if path.startswith("/api/jobs/"):
            parts = path.strip("/").split("/")
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "timeline":
                self.create_timeline(int(parts[2]))
                return
            if len(parts) == 4 and parts[2].isdigit() and parts[3] == "prep":
                self.toggle_prep_item(int(parts[2]))
                return
        if path == "/api/question-bank":
            self.create_question()
            return
        if path == "/api/interview-stories":
            self.create_story()
            return
        if path == "/api/company-notes":
            self.create_company_note()
            return
        self.send_error_json("Not found", HTTPStatus.NOT_FOUND)

    def do_PATCH(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        parts = path.strip("/").split("/")
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "jobs" and parts[2].isdigit():
            self.update_job(int(parts[2]))
            return
        if (
            len(parts) == 3
            and parts[0] == "api"
            and parts[1] == "resume-profiles"
            and parts[2].isdigit()
        ):
            self.update_resume_profile(int(parts[2]))
            return
        if len(parts) == 2 and parts[0] == "api" and parts[1] == "user-profile":
            self.update_user_profile()
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "question-bank" and parts[2].isdigit():
            self.update_question(int(parts[2]))
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "interview-stories" and parts[2].isdigit():
            self.update_story(int(parts[2]))
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "company-notes" and parts[2].isdigit():
            self.update_company_note(int(parts[2]))
            return
        self.send_error_json("Not found", HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        parts = unquote(parsed.path).strip("/").split("/")
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "jobs" and parts[2].isdigit():
            job_id = int(parts[2])
            with db() as conn:
                row = conn.execute(
                    "SELECT jd_local_path FROM job_applications WHERE id = ?", (job_id,)
                ).fetchone()
                conn.execute("DELETE FROM job_applications WHERE id = ?", (job_id,))
            if row and row["jd_local_path"]:
                target = (ROOT / row["jd_local_path"]).resolve()
                if str(target).startswith(str(JOBS_DIR.resolve())) and target.exists():
                    shutil.rmtree(target.parent, ignore_errors=True)
            self.send_json({"ok": True})
            return
        if (
            len(parts) == 3
            and parts[0] == "api"
            and parts[1] == "resume-profiles"
            and parts[2].isdigit()
        ):
            self.delete_resume_profile(int(parts[2]))
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "question-bank" and parts[2].isdigit():
            self.delete_question(int(parts[2]))
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "interview-stories" and parts[2].isdigit():
            self.delete_story(int(parts[2]))
            return
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "company-notes" and parts[2].isdigit():
            self.delete_company_note(int(parts[2]))
            return
        self.send_error_json("Not found", HTTPStatus.NOT_FOUND)

    def serve_static(self, path: str) -> None:
        if path == "/":
            path = "/index.html"
        target = (WEB_DIR / path.lstrip("/")).resolve()
        if not str(target).startswith(str(WEB_DIR.resolve())) or not target.exists():
            if path.startswith("/api/"):
                self.send_error_json(f"Not found: {path}", HTTPStatus.NOT_FOUND)
            else:
                self.send_response(HTTPStatus.NOT_FOUND)
                self.end_headers()
            return
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def list_jobs(self, query: dict) -> None:
        search = (query.get("q", [""])[0] or "").strip()
        status = (query.get("status", [""])[0] or "").strip()
        sql = """
            SELECT j.*,
                   (
                     SELECT COUNT(*)
                     FROM timeline_events t
                     WHERE t.job_application_id = j.id
                   ) AS timeline_count
            FROM job_applications j
            WHERE 1 = 1
        """
        params: list[str] = []
        if status:
            sql += " AND j.status = ?"
            params.append(status)
        sql += """
            ORDER BY
                COALESCE(NULLIF(j.apply_time, ''), j.created_at) DESC,
                j.id DESC
        """
        with db() as conn:
            rows = conn.execute(sql, params).fetchall()
        jobs = [row_to_dict(row) for row in rows]
        if search:
            jobs = [job for job in jobs if job_matches_search(job, search)]
        self.send_json(jobs)

    def get_job(self, job_id: int) -> None:
        with db() as conn:
            row = conn.execute("SELECT * FROM job_applications WHERE id = ?", (job_id,)).fetchone()
        if not row:
            self.send_error_json("Job not found", HTTPStatus.NOT_FOUND)
            return
        self.send_json(row_to_dict(row))

    def create_job(self) -> None:
        payload = self.read_json()
        company = payload.get("company_name", "").strip()
        position = payload.get("position_name", "").strip()
        if not company or not position:
            self.send_error_json("company_name and position_name are required")
            return
        try:
            stage = normalize_stage(payload.get("current_stage"))
            status = normalize_stage_status(stage, payload.get("status"))
            stage, status = apply_transition_status(stage, status)
            job_type = normalize_job_type(payload.get("job_type"))
            next_action = normalize_next_action(payload.get("next_action") or default_next_action(stage, status))
        except ValueError as error:
            self.send_error_json(str(error))
            return

        md_path, html_path = save_job_files({
            **payload,
            "job_type": job_type,
            "current_stage": stage,
            "status": status,
            "next_action": next_action,
        })
        now = utc_now()
        with db() as conn:
            cur = conn.execute(
                """
                INSERT INTO job_applications (
                    company_name, position_name, job_type,
                    company_category, department_name, office_location, commute_requirement,
                    source_url, apply_url, requirements, visa_sponsorship, salary_range,
                    rotation_preference, application_limit, duplicate_check,
                    interview_process, notes,
                    jd_local_path, html_local_path, apply_time, deadline,
                    current_stage, status, next_action, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    company,
                    position,
                    job_type,
                    payload.get("company_category", "").strip(),
                    payload.get("department_name", "").strip(),
                    payload.get("office_location", "").strip(),
                    payload.get("commute_requirement", "").strip(),
                    payload.get("source_url", "").strip(),
                    payload.get("apply_url", "").strip(),
                    payload.get("requirements", "").strip(),
                    payload.get("visa_sponsorship", "").strip(),
                    payload.get("salary_range", "").strip(),
                    payload.get("rotation_preference", "").strip(),
                    payload.get("application_limit", "").strip(),
                    payload.get("duplicate_check", "").strip(),
                    payload.get("interview_process", "").strip(),
                    payload.get("notes", "").strip(),
                    md_path,
                    html_path,
                    "" if stage == "SAVED" else payload.get("apply_time", "").strip(),
                    payload.get("deadline", "").strip(),
                    stage,
                    status,
                    next_action,
                    now,
                    now,
                ),
            )
            job_id = cur.lastrowid
            conn.execute(
                """
                INSERT INTO timeline_events (
                    job_application_id, event_type, event_title,
                    event_time, source, notes, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    job_id,
                    "SAVED" if stage == "SAVED" else "ARCHIVED" if stage == "ARCHIVED" else "APPLIED",
                    "岗位已收藏" if stage == "SAVED" else "岗位已归档" if stage == "ARCHIVED" else "岗位已投递",
                    now,
                    "manual",
                    "",
                    now,
                ),
            )
        self.get_job(job_id)

    def update_job(self, job_id: int) -> None:
        payload = self.read_json()
        allowed = {
            "company_name",
            "position_name",
            "source_url",
            "apply_url",
            "apply_time",
            "deadline",
            "job_type",
            "company_category",
            "department_name",
            "office_location",
            "commute_requirement",
            "requirements",
            "visa_sponsorship",
            "salary_range",
            "rotation_preference",
            "application_limit",
            "duplicate_check",
            "interview_process",
            "notes",
            "current_stage",
            "status",
            "next_action",
            "assessment_round",
            "interview_round",
        }
        updates = {
            key: str(payload[key] or "").strip()
            for key in allowed
            if key in payload
        }
        if "current_stage" in updates:
            try:
                updates["current_stage"] = normalize_stage(updates["current_stage"])
            except ValueError as error:
                self.send_error_json(str(error))
                return
        if "job_type" in updates:
            try:
                updates["job_type"] = normalize_job_type(updates["job_type"])
            except ValueError as error:
                self.send_error_json(str(error))
                return
        if "next_action" in updates:
            try:
                updates["next_action"] = normalize_next_action(updates["next_action"])
            except ValueError as error:
                self.send_error_json(str(error))
                return
        for round_field in ("assessment_round", "interview_round"):
            if round_field in updates:
                try:
                    updates[round_field] = str(max(int(updates[round_field]), 1))
                except ValueError:
                    self.send_error_json("Invalid round value")
                    return
        if "status" in updates:
            try:
                updates["status"] = normalize_status(updates["status"])
            except ValueError as error:
                self.send_error_json(str(error))
                return
            transition_stage, transition_status = apply_transition_status(
                updates.get("current_stage", ""),
                updates["status"],
            )
            if transition_stage:
                updates["current_stage"] = transition_stage
            updates["status"] = transition_status
            inferred_stage = stage_for_status(updates["status"])
            if inferred_stage and "current_stage" not in updates:
                updates["current_stage"] = inferred_stage
        if updates.get("current_stage") == "SAVED" and updates.get("status") not in {SAVED_TO_APPLIED_STATUS, SAVED_NOT_APPLY_STATUS}:
            updates["status"] = "SAVED"
            updates["apply_time"] = ""
        if updates.get("current_stage") == "ARCHIVED" and "status" not in updates:
            updates["status"] = "ARCHIVED"
        if not updates:
            self.send_error_json("No supported fields to update")
            return
        updates["updated_at"] = utc_now()

        with db() as conn:
            existing = conn.execute(
                "SELECT current_stage, status, next_action, assessment_round, interview_round FROM job_applications WHERE id = ?", (job_id,)
            ).fetchone()
            if not existing:
                self.send_error_json("Job not found", HTTPStatus.NOT_FOUND)
                return
            if updates.get("status") == ASSESSMENT_NEXT_ROUND_STATUS:
                updates["assessment_round"] = max(int(existing["assessment_round"] or 1) + 1, 2)
                updates["status"] = ASSESSMENT_INVITED_STATUS
                updates["current_stage"] = "ASSESSMENT"
            if updates.get("status") == INTERVIEW_NEXT_ROUND_STATUS:
                updates["interview_round"] = max(int(existing["interview_round"] or 1) + 1, 2)
                updates["status"] = INTERVIEW_INVITED_STATUS
                updates["current_stage"] = "INTERVIEW"
            if updates.get("status") == INTERVIEW_FINAL_STATUS and existing["status"] != INTERVIEW_FINAL_STATUS:
                updates["interview_round"] = int(existing["interview_round"] or 1) + 1
                updates["current_stage"] = "INTERVIEW"
            if ("current_stage" in updates or "status" in updates) and "next_action" not in updates:
                next_stage = updates.get("current_stage", existing["current_stage"])
                next_status = updates.get("status", existing["status"])
                if should_default_next_action(existing["next_action"], existing["current_stage"], existing["status"]):
                    updates["next_action"] = default_next_action(next_stage, next_status)
                    updates["updated_at"] = utc_now()
            assignments = ", ".join([f"{key} = ?" for key in updates.keys()])
            params = list(updates.values()) + [job_id]
            conn.execute(f"UPDATE job_applications SET {assignments} WHERE id = ?", params)
            stage_changed = (
                "current_stage" in updates
                and updates["current_stage"] != existing["current_stage"]
            )
            status_changed = "status" in updates and updates["status"] != existing["status"]
            if stage_changed or status_changed:
                now = utc_now()
                title_parts = []
                if stage_changed:
                    title_parts.append(f"阶段更新为 {updates['current_stage']}")
                if status_changed and updates.get("current_stage") != "SAVED":
                    title_parts.append(f"子状态更新为 {updates['status']}")
                conn.execute(
                    """
                    INSERT INTO timeline_events (
                        job_application_id, event_type, event_title,
                        event_time, source, notes, created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        job_id,
                        "STATUS_CHANGE",
                        "，".join(title_parts),
                        now,
                        "manual",
                        "",
                        now,
                    ),
                )
        self.get_job(job_id)

    def list_timeline(self, job_id: int) -> None:
        with db() as conn:
            rows = conn.execute(
                """
                SELECT *
                FROM timeline_events
                WHERE job_application_id = ?
                ORDER BY event_time DESC, id DESC
                """,
                (job_id,),
            ).fetchall()
        self.send_json([row_to_dict(row) for row in rows])

    def create_timeline(self, job_id: int) -> None:
        payload = self.read_json()
        event_title = payload.get("event_title", "").strip()
        if not event_title:
            self.send_error_json("event_title is required")
            return
        now = utc_now()
        with db() as conn:
            exists = conn.execute(
                "SELECT id FROM job_applications WHERE id = ?", (job_id,)
            ).fetchone()
            if not exists:
                self.send_error_json("Job not found", HTTPStatus.NOT_FOUND)
                return
            conn.execute(
                """
                INSERT INTO timeline_events (
                    job_application_id, event_type, event_title,
                    event_time, source, notes, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    job_id,
                    payload.get("event_type", "NOTE").strip() or "NOTE",
                    event_title,
                    payload.get("event_time", "").strip() or now,
                    payload.get("source", "manual").strip() or "manual",
                    payload.get("notes", "").strip(),
                    now,
                ),
            )
            conn.execute(
                "UPDATE job_applications SET updated_at = ? WHERE id = ?",
                (now, job_id),
            )
        self.list_timeline(job_id)

    def serve_jd(self, job_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT jd_local_path FROM job_applications WHERE id = ?", (job_id,)
            ).fetchone()
        if not row or not row["jd_local_path"]:
            self.send_error_json("JD not found", HTTPStatus.NOT_FOUND)
            return
        target = (ROOT / row["jd_local_path"]).resolve()
        if not str(target).startswith(str(JOBS_DIR.resolve())) or not target.exists():
            self.send_error_json("JD file missing", HTTPStatus.NOT_FOUND)
            return
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/markdown; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_saved_html(self, job_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT html_local_path FROM job_applications WHERE id = ?", (job_id,)
            ).fetchone()
        if not row or not row["html_local_path"]:
            self.send_error_json("Saved HTML not found", HTTPStatus.NOT_FOUND)
            return
        target = (ROOT / row["html_local_path"]).resolve()
        if not str(target).startswith(str(JOBS_DIR.resolve())) or not target.exists():
            self.send_error_json("Saved HTML file missing", HTTPStatus.NOT_FOUND)
            return
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def list_resume_profiles(self) -> None:
        with db() as conn:
            rows = conn.execute(
                """
                SELECT *
                FROM resume_profiles
                ORDER BY updated_at DESC
                """
            ).fetchall()
        self.send_json([resume_row_to_dict(row) for row in rows])

    def get_resume_profile(self, profile_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT * FROM resume_profiles WHERE id = ?", (profile_id,)
            ).fetchone()
        if not row:
            self.send_error_json("Resume profile not found", HTTPStatus.NOT_FOUND)
            return
        self.send_json(resume_row_to_dict(row))

    def create_resume_profile(self) -> None:
        payload = self.read_json()
        name = payload.get("name", "").strip()
        if not name:
            self.send_error_json("name is required")
            return
        if not payload.get("file_name") or not payload.get("file_content_base64"):
            self.send_error_json("resume file is required")
            return
        try:
            file_name, file_type, file_path = save_resume_file(payload)
            absolute_path = ROOT / file_path
            extracted_text = extract_resume_text(absolute_path)
        except (ValueError, zipfile.BadZipFile, KeyError, ET.ParseError) as error:
            self.send_error_json(str(error))
            return
        parsed, shared_candidates = split_resume_and_shared_fields(
            infer_resume_fields(extracted_text, payload)
        )
        tags = normalize_tags(payload.get("tags"))
        now = utc_now()
        with db() as conn:
            user_fields = get_user_profile_fields(conn)
            changed_user_fields = False
            for key, value in shared_candidates.items():
                if value and not user_fields.get(key):
                    user_fields[key] = value
                    changed_user_fields = True
            if changed_user_fields:
                conn.execute(
                    "UPDATE user_profile SET fields_json = ?, updated_at = ? WHERE id = 1",
                    (json.dumps(user_fields, ensure_ascii=False), now),
                )
            cur = conn.execute(
                """
                INSERT INTO resume_profiles (
                    name, tags, file_name, file_type, file_local_path,
                    extracted_text, parsed_json, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    name,
                    json.dumps(tags, ensure_ascii=False),
                    file_name,
                    file_type,
                    file_path,
                    extracted_text,
                    json.dumps(parsed, ensure_ascii=False),
                    now,
                    now,
                ),
            )
            profile_id = cur.lastrowid
        self.get_resume_profile(profile_id)

    def update_resume_profile(self, profile_id: int) -> None:
        payload = self.read_json()
        with db() as conn:
            row = conn.execute(
                "SELECT * FROM resume_profiles WHERE id = ?", (profile_id,)
            ).fetchone()
            if not row:
                self.send_error_json("Resume profile not found", HTTPStatus.NOT_FOUND)
                return
            current = resume_row_to_dict(row)
            parsed = dict(current.get("parsed_json") or {})
            for key, value in clean_profile_fields(payload, RESUME_PROFILE_KEYS).items():
                parsed[key] = value
            updates = {
                "updated_at": utc_now(),
                "parsed_json": json.dumps(parsed, ensure_ascii=False),
            }
            if "name" in payload:
                name = payload.get("name", "").strip()
                if not name:
                    self.send_error_json("name is required")
                    return
                updates["name"] = name
            if "tags" in payload:
                updates["tags"] = json.dumps(normalize_tags(payload.get("tags")), ensure_ascii=False)
            assignments = ", ".join([f"{key} = ?" for key in updates.keys()])
            conn.execute(
                f"UPDATE resume_profiles SET {assignments} WHERE id = ?",
                list(updates.values()) + [profile_id],
            )
        self.get_resume_profile(profile_id)

    def get_user_profile(self) -> None:
        with db() as conn:
            fields = get_user_profile_fields(conn)
        self.send_json(fields)

    def update_user_profile(self) -> None:
        payload = self.read_json()
        updates = clean_user_profile_updates(payload)
        with db() as conn:
            fields = get_user_profile_fields(conn)
            fields.update(updates)
            fields = {key: value for key, value in fields.items() if str(value).strip()}
            now = utc_now()
            conn.execute(
                "UPDATE user_profile SET fields_json = ?, updated_at = ? WHERE id = 1",
                (json.dumps(fields, ensure_ascii=False), now),
            )
        self.send_json(fields)

    def delete_resume_profile(self, profile_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT file_local_path FROM resume_profiles WHERE id = ?", (profile_id,)
            ).fetchone()
            conn.execute("DELETE FROM resume_profiles WHERE id = ?", (profile_id,))
        if row and row["file_local_path"]:
            target = (ROOT / row["file_local_path"]).resolve()
            if str(target).startswith(str(RESUMES_DIR.resolve())) and target.exists():
                shutil.rmtree(target.parent, ignore_errors=True)
        self.send_json({"ok": True})

    def serve_resume_file(self, profile_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT file_name, file_local_path FROM resume_profiles WHERE id = ?",
                (profile_id,),
            ).fetchone()
        if not row or not row["file_local_path"]:
            self.send_error_json("Resume file not found", HTTPStatus.NOT_FOUND)
            return
        target = (ROOT / row["file_local_path"]).resolve()
        if not str(target).startswith(str(RESUMES_DIR.resolve())) or not target.exists():
            self.send_error_json("Resume file missing", HTTPStatus.NOT_FOUND)
            return
        body = target.read_bytes()
        content_type = mimetypes.guess_type(row["file_name"])[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Disposition", f"inline; filename={row['file_name']}")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


    def get_job_prep(self, job_id: int) -> None:
        try:
         return self._get_job_prep(job_id)
        except Exception as exc:
            self.send_error_json(str(exc), HTTPStatus.INTERNAL_SERVER_ERROR)

    def _get_job_prep(self, job_id: int) -> None:
        with db() as conn:
            job = conn.execute(
                "SELECT id, company_name, position_name, current_stage, status FROM job_applications WHERE id = ?",
                (job_id,),
            ).fetchone()
            if not job:
                self.send_error_json("Job not found", HTTPStatus.NOT_FOUND)
                return
            questions = conn.execute(
                "SELECT * FROM question_bank ORDER BY category, created_at"
            ).fetchall()
            stories = conn.execute(
                "SELECT * FROM interview_stories ORDER BY created_at"
            ).fetchall()
            ready_rows = conn.execute(
                "SELECT item_type, item_id, is_ready FROM interview_prep WHERE job_application_id = ?",
                (job_id,),
            ).fetchall()
        ready_map = {(r["item_type"], r["item_id"]): r["is_ready"] for r in ready_rows}
        q_list = []
        for q in questions:
            d = question_row_to_dict(q)
            d["is_ready"] = ready_map.get(("question", d["id"]), 0)
            q_list.append(d)
        s_list = []
        for s in stories:
            d = story_row_to_dict(s)
            d["is_ready"] = ready_map.get(("story", d["id"]), 0)
            s_list.append(d)
        self.send_json({"job": row_to_dict(job), "questions": q_list, "stories": s_list})

    def toggle_prep_item(self, job_id: int) -> None:
        body = self.read_json()
        item_type = body.get("item_type")
        item_id = body.get("item_id")
        is_ready = int(bool(body.get("is_ready", 0)))
        if item_type not in ("question", "story") or not isinstance(item_id, int):
            self.send_error_json("Invalid params", HTTPStatus.BAD_REQUEST)
            return
        with db() as conn:
            conn.execute(
                """INSERT INTO interview_prep (job_application_id, item_type, item_id, is_ready)
                   VALUES (?, ?, ?, ?)
                   ON CONFLICT(job_application_id, item_type, item_id)
                   DO UPDATE SET is_ready = excluded.is_ready""",
                (job_id, item_type, item_id, is_ready),
            )
        self.send_json({"ok": True})

    def get_weekly_review(self) -> None:
        from datetime import timedelta
        one_week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(timespec="seconds")
        with db() as conn:
            new_jobs = conn.execute(
                """
                SELECT id, company_name, position_name, current_stage, status, created_at
                FROM job_applications WHERE created_at >= ?
                ORDER BY created_at DESC
                """,
                (one_week_ago,),
            ).fetchall()
            recent_timeline = conn.execute(
                """
                SELECT t.id, t.event_title, t.event_time, t.source, t.notes,
                       j.id AS job_id, j.company_name, j.position_name
                FROM timeline_events t
                JOIN job_applications j ON t.job_application_id = j.id
                WHERE t.created_at >= ?
                ORDER BY t.created_at DESC
                LIMIT 30
                """,
                (one_week_ago,),
            ).fetchall()
            stale_jobs = conn.execute(
                """
                SELECT id, company_name, position_name, current_stage, status, updated_at
                FROM job_applications
                WHERE updated_at < ?
                AND status NOT LIKE '%REJECTED%'
                AND current_stage NOT IN ('SAVED')
                ORDER BY updated_at ASC
                """,
                (one_week_ago,),
            ).fetchall()
            rejected_this_week = conn.execute(
                """
                SELECT id, company_name, position_name, current_stage, status, updated_at
                FROM job_applications
                WHERE status LIKE '%REJECTED%'
                AND updated_at >= ?
                ORDER BY updated_at DESC
                """,
                (one_week_ago,),
            ).fetchall()
        self.send_json({
            "new_jobs": [row_to_dict(r) for r in new_jobs],
            "recent_timeline": [row_to_dict(r) for r in recent_timeline],
            "stale_jobs": [row_to_dict(r) for r in stale_jobs],
            "rejected_this_week": [row_to_dict(r) for r in rejected_this_week],
            "period_days": 7,
        })

    def get_calendar_day(self, query: dict) -> None:
        day = (query.get("date", [""])[0] or "").strip()
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", day):
            self.send_error_json("date must be YYYY-MM-DD")
            return

        with db() as conn:
            recorded_jobs = conn.execute(
                """
                SELECT id, company_name, position_name, current_stage, status, created_at
                FROM job_applications
                WHERE substr(created_at, 1, 10) = ?
                ORDER BY created_at DESC
                """,
                (day,),
            ).fetchall()
            applied_jobs = conn.execute(
                """
                SELECT id, company_name, position_name, current_stage, status, apply_time
                FROM job_applications
                WHERE substr(apply_time, 1, 10) = ?
                ORDER BY apply_time DESC
                """,
                (day,),
            ).fetchall()
            timeline_events = conn.execute(
                """
                SELECT t.id, t.event_title, t.event_time, t.source, t.notes,
                       j.id AS job_id, j.company_name, j.position_name
                FROM timeline_events t
                JOIN job_applications j ON t.job_application_id = j.id
                WHERE substr(t.event_time, 1, 10) = ?
                ORDER BY t.event_time DESC, t.id DESC
                """,
                (day,),
            ).fetchall()

        self.send_json({
            "date": day,
            "recorded_jobs": [row_to_dict(r) for r in recorded_jobs],
            "applied_jobs": [row_to_dict(r) for r in applied_jobs],
            "timeline_events": [row_to_dict(r) for r in timeline_events],
        })

    def list_question_bank(self) -> None:
        with db() as conn:
            rows = conn.execute(
                "SELECT * FROM question_bank ORDER BY updated_at DESC"
            ).fetchall()
        self.send_json([question_row_to_dict(r) for r in rows])

    def get_question(self, question_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT * FROM question_bank WHERE id = ?", (question_id,)
            ).fetchone()
        if not row:
            self.send_error_json("Question not found", HTTPStatus.NOT_FOUND)
            return
        self.send_json(question_row_to_dict(row))

    def create_question(self) -> None:
        payload = self.read_json()
        question = payload.get("question", "").strip()
        if not question:
            self.send_error_json("question is required")
            return
        answers = payload.get("answers", [])
        if not isinstance(answers, list):
            answers = []
        tags = normalize_tags(payload.get("tags"))
        now = utc_now()
        with db() as conn:
            cur = conn.execute(
                """
                INSERT INTO question_bank (question, category, tags, answers_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    question,
                    payload.get("category", "").strip() or "general",
                    json.dumps(tags, ensure_ascii=False),
                    json.dumps(answers, ensure_ascii=False),
                    now,
                    now,
                ),
            )
            qid = cur.lastrowid
        self.get_question(qid)

    def update_question(self, question_id: int) -> None:
        payload = self.read_json()
        with db() as conn:
            row = conn.execute(
                "SELECT id FROM question_bank WHERE id = ?", (question_id,)
            ).fetchone()
            if not row:
                self.send_error_json("Question not found", HTTPStatus.NOT_FOUND)
                return
            updates: dict = {"updated_at": utc_now()}
            if "question" in payload:
                q = payload["question"].strip()
                if not q:
                    self.send_error_json("question is required")
                    return
                updates["question"] = q
            if "category" in payload:
                updates["category"] = payload["category"].strip() or "general"
            if "tags" in payload:
                updates["tags"] = json.dumps(normalize_tags(payload["tags"]), ensure_ascii=False)
            if "answers" in payload:
                answers = payload["answers"]
                updates["answers_json"] = json.dumps(answers if isinstance(answers, list) else [], ensure_ascii=False)
            assignments = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(
                f"UPDATE question_bank SET {assignments} WHERE id = ?",
                list(updates.values()) + [question_id],
            )
        self.get_question(question_id)

    def delete_question(self, question_id: int) -> None:
        with db() as conn:
            conn.execute("DELETE FROM question_bank WHERE id = ?", (question_id,))
        self.send_json({"ok": True})

    def list_interview_stories(self) -> None:
        with db() as conn:
            rows = conn.execute(
                "SELECT * FROM interview_stories ORDER BY updated_at DESC"
            ).fetchall()
        self.send_json([story_row_to_dict(r) for r in rows])

    def get_story(self, story_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT * FROM interview_stories WHERE id = ?", (story_id,)
            ).fetchone()
        if not row:
            self.send_error_json("Story not found", HTTPStatus.NOT_FOUND)
            return
        self.send_json(story_row_to_dict(row))

    def create_story(self) -> None:
        payload = self.read_json()
        title = payload.get("title", "").strip()
        if not title:
            self.send_error_json("title is required")
            return
        tags = normalize_tags(payload.get("tags"))
        now = utc_now()
        with db() as conn:
            cur = conn.execute(
                """
                INSERT INTO interview_stories
                    (title, situation, task, action, result, tags, notes, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    title,
                    payload.get("situation", "").strip(),
                    payload.get("task", "").strip(),
                    payload.get("action", "").strip(),
                    payload.get("result", "").strip(),
                    json.dumps(tags, ensure_ascii=False),
                    payload.get("notes", "").strip(),
                    now,
                    now,
                ),
            )
            story_id = cur.lastrowid
        self.get_story(story_id)

    def update_story(self, story_id: int) -> None:
        payload = self.read_json()
        with db() as conn:
            row = conn.execute(
                "SELECT id FROM interview_stories WHERE id = ?", (story_id,)
            ).fetchone()
            if not row:
                self.send_error_json("Story not found", HTTPStatus.NOT_FOUND)
                return
            updates: dict = {"updated_at": utc_now()}
            for field in ("title", "situation", "task", "action", "result", "notes"):
                if field in payload:
                    if field == "title" and not payload[field].strip():
                        self.send_error_json("title is required")
                        return
                    updates[field] = payload[field].strip()
            if "tags" in payload:
                updates["tags"] = json.dumps(normalize_tags(payload["tags"]), ensure_ascii=False)
            assignments = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(
                f"UPDATE interview_stories SET {assignments} WHERE id = ?",
                list(updates.values()) + [story_id],
            )
        self.get_story(story_id)

    def delete_story(self, story_id: int) -> None:
        with db() as conn:
            conn.execute("DELETE FROM interview_stories WHERE id = ?", (story_id,))
        self.send_json({"ok": True})

    def list_company_notes(self) -> None:
        with db() as conn:
            rows = conn.execute(
                "SELECT * FROM company_notes ORDER BY updated_at DESC"
            ).fetchall()
        self.send_json([company_note_row_to_dict(r) for r in rows])

    def get_company_note(self, note_id: int) -> None:
        with db() as conn:
            row = conn.execute(
                "SELECT * FROM company_notes WHERE id = ?", (note_id,)
            ).fetchone()
        if not row:
            self.send_error_json("Company note not found", HTTPStatus.NOT_FOUND)
            return
        self.send_json(company_note_row_to_dict(row))

    def create_company_note(self) -> None:
        payload = self.read_json()
        company_name = payload.get("company_name", "").strip()
        if not company_name:
            self.send_error_json("company_name is required")
            return
        tags = normalize_tags(payload.get("tags"))
        now = utc_now()
        with db() as conn:
            cur = conn.execute(
                """
                INSERT INTO company_notes
                    (company_name, industry, overview, culture, why_interested,
                     interview_focus, notes, tags, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    company_name,
                    payload.get("industry", "").strip(),
                    payload.get("overview", "").strip(),
                    payload.get("culture", "").strip(),
                    payload.get("why_interested", "").strip(),
                    payload.get("interview_focus", "").strip(),
                    payload.get("notes", "").strip(),
                    json.dumps(tags, ensure_ascii=False),
                    now,
                    now,
                ),
            )
            note_id = cur.lastrowid
        self.get_company_note(note_id)

    def update_company_note(self, note_id: int) -> None:
        payload = self.read_json()
        with db() as conn:
            row = conn.execute(
                "SELECT id FROM company_notes WHERE id = ?", (note_id,)
            ).fetchone()
            if not row:
                self.send_error_json("Company note not found", HTTPStatus.NOT_FOUND)
                return
            updates: dict = {"updated_at": utc_now()}
            for field in ("company_name", "industry", "overview", "culture",
                          "why_interested", "interview_focus", "notes"):
                if field in payload:
                    if field == "company_name" and not payload[field].strip():
                        self.send_error_json("company_name is required")
                        return
                    updates[field] = payload[field].strip()
            if "tags" in payload:
                updates["tags"] = json.dumps(normalize_tags(payload["tags"]), ensure_ascii=False)
            assignments = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(
                f"UPDATE company_notes SET {assignments} WHERE id = ?",
                list(updates.values()) + [note_id],
            )
        self.get_company_note(note_id)

    def delete_company_note(self, note_id: int) -> None:
        with db() as conn:
            conn.execute("DELETE FROM company_notes WHERE id = ?", (note_id,))
        self.send_json({"ok": True})


def main() -> None:
    init_db()
    port = 8765
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Job Tracker MVP running at http://127.0.0.1:{port}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()
