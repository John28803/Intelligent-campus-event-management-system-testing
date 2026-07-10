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

    return profile_text

def generate_recommendations(user):
    events = list(Event.objects.all())

    if not SKLEARN_AVAILABLE or TfidfVectorizer is None or cosine_similarity is None:
        return [(event, 1.0) for event in events[:5]]

    profile = get_user_profile(user)
    documents = [profile]
    event_list = []

    for event in events:
        text = f"{event.category} {event.tags or ''}".strip()
        documents.append(text)
        event_list.append(event)

    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(documents)
    similarities = cosine_similarity(matrix[0:1], matrix[1:])
    scores = similarities.flatten()

    ranked = sorted(
        zip(event_list, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:5]