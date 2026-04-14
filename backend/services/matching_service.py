from typing import List

def normalize_skill(s: str) -> str:
    return s.lower().strip().replace("-","").replace(".","").replace(" ","")

ALIASES = {
    "js":       ["javascript","js"],
    "ts":       ["typescript","ts"],
    "py":       ["python","py"],
    "reactjs":  ["react","reactjs"],
    "nodejs":   ["nodejs","node"],
    "postgres": ["postgresql","postgres","psql"],
    "mongo":    ["mongodb","mongo"],
    "ml":       ["machinelearning","ml","ai"],
}

def calculate_match_score(user_skills: List[str], job_skills: List[str]) -> int:
    if not job_skills:  return 50
    if not user_skills: return 0
    user_norm = [normalize_skill(s) for s in user_skills]
    job_norm  = [normalize_skill(s) for s in job_skills]

    def matches(us, js):
        if us == js: return True
        for variants in ALIASES.values():
            if us in variants and js in variants: return True
        if us in js or js in us: return True
        return False

    matched = sum(1 for js in job_norm if any(matches(us, js) for us in user_norm))
    base    = int((matched / len(job_norm)) * 100)
    bonus   = min(10, max(0, len(user_skills) - len(job_skills)) * 2)
    return min(100, max(0, base + bonus))
