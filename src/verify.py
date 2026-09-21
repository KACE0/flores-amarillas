"""Comprueba el contrato del archivo exportado y los datos embebidos."""
from pathlib import Path
from html.parser import HTMLParser
import json

ROOT = Path(__file__).resolve().parent.parent

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids, self.scripts, self.external = set(), {}, []
        self.active = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'script':
            self.active = a.get('id', 'unnamed')
            self.scripts[self.active] = ''
            if 'src' in a:
                self.external.append(a['src'])
        if tag in ('img', 'link', 'iframe') and (a.get('src') or a.get('href')):
            self.external.append(a.get('src') or a.get('href'))

    def handle_endtag(self, tag):
        if tag == 'script':
            self.active = None

    def handle_data(self, data):
        if self.active:
            self.scripts[self.active] += data

master = Document((ROOT / 'index.html').read_text(encoding='utf-8'))
template = json.loads(master.scripts['giftTemplate'])
assert template.count('__GIFT_DATA__') == 1
for forbidden in ('giftTemplate', 'openWorkshop', 'workshopTitle', 'giftForm', 'editName', 'localStorage', 'data-editor', 'Generar regalo'):
    assert forbidden not in template, f'El regalo contiene código del editor: {forbidden}'

config = json.loads((ROOT / 'src/config.json').read_text(encoding='utf-8'))
config['name'] = 'Lucía <3 & Sol'
config['message'] = 'Primera línea.\n\n</script><script>window.bad=true</script>\n♡'
config['notes'][0]['title'] = 'Un mensaje propio'
encoded = json.dumps(config, ensure_ascii=False).replace('<', r'\u003c').replace('>', r'\u003e').replace('&', r'\u0026')
exported = Document(template.replace('__GIFT_DATA__', encoded))
assert json.loads(exported.scripts['giftConfig']) == config
assert len(exported.scripts) == 3, 'Los datos no deben crear scripts adicionales'
assert not exported.external, 'El regalo debe ser autónomo'
assert len(config['notes']) == 8
sample = Document((ROOT / 'regalo-ejemplo.html').read_text(encoding='utf-8'))
assert not sample.external
assert 'giftTemplate' not in sample.ids
assert all(s in sample.ids for s in ('openEnvelope', 'revealGarden', 'bouquetCanvas', 'flowerPicker', 'cardMessage'))
print('OK: exportación sin editor, 8 flores, texto seguro con acentos y saltos, sin dependencias externas.')
