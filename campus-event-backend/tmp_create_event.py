import json
import urllib.request

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgzNjE0MjIzLCJpYXQiOjE3ODM2MTM5MjMsImp0aSI6ImMxYzc3NDRiMGUyYzQ2YTNhZjFhYTBmZDc1MTBhYmU0IiwidXNlcl9pZCI6IjIifQ.jXF8FuWiF4j6KT9EitzKgZoO1Hf_9EsPcWNtjrCRmek'
data = {
    'title': 'Campus Tech Meetup',
    'description': 'A live meetup for students interested in software and AI.',
    'category': 'technology',
    'venue': 'Main Hall',
    'date': '2026-08-10',
    'time': '14:00:00',
    'capacity': 50,
    'tags': 'tech,ai',
    'target_audience': 'students'
}
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/events/',
    data=json.dumps(data).encode(),
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'},
    method='POST',
)
with urllib.request.urlopen(req) as res:
    print(res.read().decode())
