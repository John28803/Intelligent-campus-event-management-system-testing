from events.models import Event
from attendance.models import Attendance

try:
    import pandas as pd  # noqa: F401
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except Exception:
    pd = None
    TfidfVectorizer = None
    cosine_similarity = None
    SKLEARN_AVAILABLE = False

def get_user_profile(user):

    attended_events = Event.objects.filter(
        attendance__user=user,
        attendance__checked_in=True
    )

    profile_text = ""

    for event in attended_events:

        profile_text += " "

        profile_text += event.category

        if event.tags:
            profile_text += " " + event.tags

    return profile_text.strip()

def calculate_text_similarity_scores(profile_text, event_texts):
    if not SKLEARN_AVAILABLE or not profile_text:
        return [1.0 for _ in event_texts]

    documents = [profile_text] + event_texts
    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(documents)
    similarities = cosine_similarity(matrix[0:1], matrix[1:])
    return list(similarities.flatten())

def generate_recommendations(user):
    registered_ids = set(
        Event.objects.filter(
            attendance__user=user
        ).values_list("id", flat=True)
    )

    if len(registered_ids) < 10:
        return []

    events = list(Event.objects.exclude(id__in=registered_ids))
    if not events:
        return []

    documents = [f"{event.category} {event.tags or ''}".strip() for event in events]

    scores = calculate_text_similarity_scores(get_user_profile(user), documents)

    ranked = sorted(
        zip(events, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:5]