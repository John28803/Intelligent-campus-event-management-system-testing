import hashlib

def generate_hash(
    username,
    event_title
):

    text = (
        username +
        event_title
    )

    return hashlib.sha256(
        text.encode()
    ).hexdigest()