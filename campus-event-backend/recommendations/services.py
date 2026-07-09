import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from events.models import Event
from attendance.models import Attendance

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

    profile = get_user_profile(user)

    events = Event.objects.all()

    documents = [profile]

    event_list = []

    for event in events:

        text = f"{event.category} {event.tags}"

        documents.append(text)

        event_list.append(event)

    vectorizer = TfidfVectorizer()

    matrix = vectorizer.fit_transform(
        documents
    )

    similarities = cosine_similarity(
        matrix[0:1],
        matrix[1:]
    )

    scores = similarities.flatten()

    ranked = sorted(
        zip(event_list, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:5]