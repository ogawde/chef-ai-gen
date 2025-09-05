from typing import List, Tuple, Optional

BLOCKED_TERMS = [
    'human head', 'human', 'head', 'brain', 'heart', 'liver', 'kidney', 'organ',
    'body part', 'limb', 'flesh', 'corpse', 'cadaver',
    'poison', 'toxic', 'chemical', 'bleach', 'detergent', 'soap', 'paint',
    'gasoline', 'fuel', 'alcohol', 'drug', 'medicine', 'pill', 'tablet',
    'plastic', 'metal', 'glass', 'wood', 'stone', 'rock', 'dirt', 'soil',
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
