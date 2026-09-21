"""Construye dos HTML autónomos, sin red ni herramientas al abrirlos."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent

def read(name):
    return (ROOT / name).read_text(encoding='utf-8-sig')

def safe_json(value):
    return json.dumps(value, ensure_ascii=False).replace('<', r'\u003c').replace('>', r'\u003e').replace('&', r'\u0026')

def build():
    config = json.loads(read('config.json'))
    engine = '/* Three.js r160.1 · MIT License\n' + read('THREE-LICENSE.txt') + '\n*/\n' + read('three.min.js')
    base = read('gift.html').replace('__STYLE__', read('gift.css')).replace('__THREE__', engine).replace('__RUNTIME__', read('gift.js'))
    gift_template = base.replace('__EDITOR__', '')
    gift = gift_template.replace('__GIFT_DATA__', safe_json(config))
    editor = '<style data-editor="true">' + read('editor.css') + '</style>\n'
    editor += '<script type="application/json" id="giftTemplate" data-editor="true">' + safe_json(gift_template) + '</script>\n'
    editor += '<script data-editor="true">' + read('editor.js') + '</script>'
    master = base.replace('__GIFT_DATA__', safe_json(config)).replace('__EDITOR__', editor)
    (ROOT.parent / 'index.html').write_text(master, encoding='utf-8')
    (ROOT.parent / 'regalo-ejemplo.html').write_text(gift, encoding='utf-8')
    print(f'Maestro: {len(master.encode()):,} bytes | Regalo: {len(gift.encode()):,} bytes')

if __name__ == '__main__':
    build()
