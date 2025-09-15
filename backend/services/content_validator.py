import re
from typing import List, Tuple, Optional

BLOCKED_TERMS = [
    'human head', 'human', 'head', 'brain', 'heart', 'liver', 'kidney', 'organ',
    'body part', 'limb', 'flesh', 'corpse', 'cadaver',
    'poison', 'toxic', 'chemical', 'bleach', 'detergent', 'soap', 'paint',
    'gasoline', 'fuel', 'alcohol', 'drug', 'medicine', 'pill', 'tablet',
    'plastic', 'metal', 'glass', 'wood', 'stone', 'rock', 'dirt', 'soil',
    'grass',
    'paper', 'fabric', 'cloth', 'rubber', 'leather',
    'cannabis', 'marijuana', 'cocaine', 'heroin', 'meth', 'lsd',
    'feces', 'urine', 'blood', 'vomit', 'excrement',
    'knife', 'weapon', 'gun', 'bullet', 'explosive',
    'dog', 'cat', 'hamster', 'rabbit', 'bird', 'parrot', 'canary',
    'dolphin', 'whale', 'seal', 'penguin', 'elephant', 'tiger', 'lion',
    'insect', 'bug', 'worm', 'spider', 'roach', 'rat', 'mouse',
]


def validate_ingredients(ingredients: List[str]) -> Tuple[bool, Optional[str]]:
    if not ingredients or len(ingredients) == 0:
        return False, "At least one ingredient is required"
    
    normalized_text = " ".join(ing.lower().strip() for ing in ingredients)
    
    for term in BLOCKED_TERMS:
        if term.lower() in normalized_text:
            return False, "Invalid ingredient detected. Please use only food ingredients."
    
    return True, None


def normalize_ingredients(ingredients: List[str]) -> List[str]:
    parsed_items: List[str] = []

    for raw_item in ingredients:
        parts = [part.strip().lower() for part in re.split(r"[,\s]+", raw_item) if part.strip()]
        parsed_items.extend(parts)

    filtered_items: List[str] = []
    for item in parsed_items:
        if any(blocked_term in item for blocked_term in BLOCKED_TERMS):
            continue
        filtered_items.append(item)

    return list(dict.fromkeys(filtered_items))
