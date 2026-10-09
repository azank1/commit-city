"""Fill the prebuilt viewer template with a payload and the user's avatar -> one offline HTML file."""
import base64
import html
import json
import os
from importlib import resources

PLACEHOLDER_DATA, PLACEHOLDER_AVATAR = '__DATA__', '__AVATAR__'


def avatar_data_uri(gh, url, log):
    try:
        raw, ctype = gh.download(url + ('&' if '?' in url else '?') + 's=460')
    except Exception as e:                       # the viewer draws a plain disc if this is empty
        log(f'  avatar download failed ({e}); continuing without it')
        return ''
    if raw[:4] == b'\x89PNG':
        ctype = 'image/png'
    elif raw[:3] == b'\xff\xd8\xff':
        ctype = 'image/jpeg'
    elif raw[:3] == b'GIF':
        ctype = 'image/gif'
    return f'data:{ctype};base64,' + base64.b64encode(raw).decode()


def render(payload, avatar_uri, out_path):
    tpl = resources.files('commit_city').joinpath('viewer.html').read_text(encoding='utf-8')
    data = json.dumps(payload, separators=(',', ':'), ensure_ascii=False).replace('<', '\\u003c')   # nothing can close the <script>
    page = tpl.replace(PLACEHOLDER_AVATAR, html.escape(avatar_uri, quote=True), 1)
    page = page.replace(PLACEHOLDER_DATA, data, 1)
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(page)
    return len(page)

