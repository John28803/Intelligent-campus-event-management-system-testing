from events.models import Event
from attendance.models import Attendance

try:
    import pandas as pd
    from sklearn.linear_model import LinearRegression
    SKLEARN_AVAILABLE = True
except Exception:
    pd = None
    LinearRegression = None
    SKLEARN_AVAILABLE = False

def build_dataset():
    if not SKLEARN_AVAILABLE or pd is None:
        return None

    events = Event.objects.all()

    data = []

    for event in events:
        actual_attendance = Attendance.objects.filter(
            event=event,
            checked_in=True
        ).count()

        category_value = {
            'technology': 1,
            'career': 2,
            'sports': 3,
            'education': 4
        }.get(event.category, 0)

        data.append([
            event.capacity,
            category_value,
            actual_attendance
        ])

    return pd.DataFrame(
        data,
        columns=[
            'capacity',
            'category',
            'attendance'
        ]
    )

def train_model():
    df = build_dataset()

    if not df or len(df) < 2 or not SKLEARN_AVAILABLE or LinearRegression is None:
        return None

    X = df[['capacity', 'category']]
    y = df['attendance']

    model = LinearRegression()
    model.fit(X, y)

    return model

def predict_event_attendance(event):
    model = train_model()

    if not model:
        return 0

    category_value = {
        'technology': 1,
        'career': 2,
        'sports': 3,
        'education': 4
    }.get(event.category, 0)

    prediction = model.predict([[event.capacity, category_value]])
    return round(prediction[0])