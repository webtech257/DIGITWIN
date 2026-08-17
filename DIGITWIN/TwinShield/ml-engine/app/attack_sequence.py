from typing import List, Dict, Any

ATTACK_SEQUENCE_STAGES = [
    "Unusual Login",
    "Unusual Resource Access",
    "Privilege Violation",
    "Sensitive Data Access",
    "Bulk Query",
    "Export Attempt"
]

class AttackSequenceDetector:

    def detect_sequence(self, recent_actions: List[str]) -> Dict[str, Any]:
        if not recent_actions:
            return {
                "detected_stage": "None",
                "matched_steps_count": 0,
                "sequence_score_factor": 0.0,
                "progression_percentage": 0.0
            }

        matched_indices = []
        for action in recent_actions:
            for idx, stage in enumerate(ATTACK_SEQUENCE_STAGES):
                if stage.lower() in action.lower():
                    matched_indices.append(idx)

        if not matched_indices:
            return {
                "detected_stage": "None",
                "matched_steps_count": 0,
                "sequence_score_factor": 0.0,
                "progression_percentage": 0.0
            }

        highest_stage_idx = max(matched_indices)
        matched_count = len(set(matched_indices))
        detected_stage = ATTACK_SEQUENCE_STAGES[highest_stage_idx]
        
        # Sequence score scales with how far along the attack chain the user has progressed
        sequence_factor = min(1.0, (highest_stage_idx + 1) / float(len(ATTACK_SEQUENCE_STAGES)))

        return {
            "detected_stage": detected_stage,
            "matched_steps_count": matched_count,
            "sequence_score_factor": round(sequence_factor, 2),
            "progression_percentage": round(sequence_factor * 100.0, 1)
        }

sequence_detector = AttackSequenceDetector()
