from __future__ import annotations

import base64
import json
import sys
import tempfile
import threading
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import server


def request(base: str, method: str, path: str, payload: dict | None = None) -> dict:
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base}{path}",
        data=body,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        server.ROOT = root
        server.DATA_DIR = root / "data"
        server.JOBS_DIR = server.DATA_DIR / "jobs"
        server.RESUMES_DIR = server.DATA_DIR / "resumes"
        server.DB_PATH = server.DATA_DIR / "tracker.db"
        server.init_db()

        httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{httpd.server_port}"
        try:
            # ── Jobs CRUD ────────────────────────────────────────────────────
            job = request(base, "POST", "/api/jobs", {
                "company_name": "Smoke Co",
                "position_name": "Product Analyst",
                "current_stage": "SAVED",
                "status": "SAVED",
                "next_action": "DECIDE",
                "company_category": "CONSULTING",
                "department_name": "Analytics",
                "office_location": "London",
                "commute_requirement": "HYBRID",
                "requirements": "SQL and dashboarding",
                "visa_sponsorship": "UNCLEAR",
                "salary_range": "Glassdoor estimate",
                "rotation_preference": "OPTIONAL",
                "application_limit": "LIMITED_ROLES",
                "duplicate_check": "UNCLEAR",
                "interview_process": "TWO_ROUNDS",
                "notes": "Track salary source",
            })
            assert job["next_action"] == "DECIDE"
            assert job["company_category"] == "CONSULTING"
            assert job["department_name"] == "Analytics"
            assert job["visa_sponsorship"] == "UNCLEAR"

            updated = request(base, "PATCH", f"/api/jobs/{job['id']}", {"status": "OA"})
            assert updated["current_stage"] == "ASSESSMENT"
            assert updated["next_action"] == "PREPARE"

            updated = request(base, "PATCH", f"/api/jobs/{job['id']}", {
                "next_action": "ARCHIVE",
                "company_category": "PEVC",
                "notes": "Updated tracker note",
            })
            assert updated["next_action"] == "ARCHIVE"
            assert updated["company_category"] == "PEVC"
            assert updated["notes"] == "Updated tracker note"

            jobs_list = request(base, "GET", "/api/jobs")
            assert isinstance(jobs_list, list) and len(jobs_list) == 1
            assert jobs_list[0]["id"] == job["id"]
            searched_jobs = request(base, "GET", "/api/jobs?q=tracker%20note")
            assert len(searched_jobs) == 1 and searched_jobs[0]["id"] == job["id"]

            # ── Timeline ─────────────────────────────────────────────────────
            timeline = request(base, "POST", f"/api/jobs/{job['id']}/timeline", {
                "event_title": "First interview",
                "event_type": "INTERVIEW",
                "notes": "Technical round",
            })
            assert isinstance(timeline, list) and len(timeline) >= 1
            assert any(e["event_title"] == "First interview" for e in timeline)

            # ── User profile ─────────────────────────────────────────────────
            profile = request(base, "PATCH", "/api/user-profile", {
                "review_note_2026-05-24": "Daily note",
                "week_note_2026_21": "Weekly note",
            })
            assert profile["review_note_2026-05-24"] == "Daily note"
            assert profile["week_note_2026_21"] == "Weekly note"

            day = request(base, "GET", "/api/calendar-day?date=2026-05-24")
            assert "timeline_events" in day

            # ── Weekly review ─────────────────────────────────────────────────
            weekly = request(base, "GET", "/api/weekly-review")
            for key in ("rejected_this_week", "stale_jobs", "new_jobs", "recent_timeline"):
                assert key in weekly, f"Missing key in weekly-review response: {key}"
            assert isinstance(weekly["new_jobs"], list)

            # ── Question bank CRUD ────────────────────────────────────────────
            q = request(base, "POST", "/api/question-bank", {
                "question": "Tell me about yourself.",
                "category": "behavioral",
                "tags": ["intro"],
                "answers": [],
            })
            assert q["question"] == "Tell me about yourself."

            q_updated = request(base, "PATCH", f"/api/question-bank/{q['id']}", {
                "answers": [{"label": "v1", "content": "I am a data analyst."}],
            })
            assert len(q_updated["answers"]) == 1

            del_q = request(base, "DELETE", f"/api/question-bank/{q['id']}")
            assert del_q["ok"] is True

            # ── Interview stories CRUD ────────────────────────────────────────
            story = request(base, "POST", "/api/interview-stories", {
                "title": "Led a migration project",
                "situation": "Legacy system needed upgrade",
                "task": "Lead migration",
                "action": "Planned and executed",
                "result": "Done on time",
            })
            assert story["title"] == "Led a migration project"

            story_updated = request(base, "PATCH", f"/api/interview-stories/{story['id']}", {
                "result": "Done 2 weeks early",
            })
            assert story_updated["result"] == "Done 2 weeks early"

            del_story = request(base, "DELETE", f"/api/interview-stories/{story['id']}")
            assert del_story["ok"] is True

            # ── Company notes CRUD ────────────────────────────────────────────
            note = request(base, "POST", "/api/company-notes", {
                "company_name": "Acme Corp",
                "industry": "Tech",
                "overview": "Great company",
            })
            assert note["company_name"] == "Acme Corp"

            note_updated = request(base, "PATCH", f"/api/company-notes/{note['id']}", {
                "overview": "Very great company",
            })
            assert note_updated["overview"] == "Very great company"

            del_note = request(base, "DELETE", f"/api/company-notes/{note['id']}")
            assert del_note["ok"] is True

            # ── Resume profile (plain-text file) ─────────────────────────────
            txt_b64 = base64.b64encode(b"Charlotte Yu\nData Analyst\nPython, SQL").decode()
            rp = request(base, "POST", "/api/resume-profiles", {
                "name": "General",
                "file_name": "resume.txt",
                "file_content_base64": txt_b64,
                "tags": ["general"],
            })
            assert rp["name"] == "General"

            rp_updated = request(base, "PATCH", f"/api/resume-profiles/{rp['id']}", {
                "name": "General v2",
            })
            assert rp_updated["name"] == "General v2"

            del_rp = request(base, "DELETE", f"/api/resume-profiles/{rp['id']}")
            assert del_rp["ok"] is True

            # ── Job deletion ──────────────────────────────────────────────────
            del_job = request(base, "DELETE", f"/api/jobs/{job['id']}")
            assert del_job["ok"] is True

            jobs_after = request(base, "GET", "/api/jobs")
            assert len(jobs_after) == 0

        finally:
            httpd.shutdown()
            thread.join(timeout=5)

    print("All smoke tests passed.")


if __name__ == "__main__":
    main()
