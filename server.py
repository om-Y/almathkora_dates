#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
خادم متجر المذخورة المحلي
يقوم بحفظ المنتجات وتحديث ملف products.js وحفظ الصور في مجلد images/ مباشرة على جهازك
"""

import http.server
import socketserver
import json
import os
import base64
import re
import webbrowser
import threading
import time

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")
PRODUCTS_FILE = os.path.join(BASE_DIR, "products.js")

# التأكد من وجود مجلد images
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR, exist_ok=True)


def update_products_file_on_disk(products_list):
    """تحديث ملف products.js على القرص مباشرة"""
    version_id = f"v_{int(time.time())}"
    products_json = json.dumps(products_list, ensure_ascii=False, indent=4)
    
    file_content = f"""// تم حفظ وتحديث هذا الملف تلقائياً من خادم المتجر المحلي
const initialDefaultProducts = {products_json};

// Product Data Version - updates whenever products are saved
const PRODUCTS_DATA_VERSION = "{version_id}";

function loadStoredProducts() {{
    try {{
        const storedVersion = localStorage.getItem('almathkora_products_version');
        const stored = localStorage.getItem('almathkora_products');

        // If the code file products.js was updated, sync new products from repository
        if (stored && storedVersion === PRODUCTS_DATA_VERSION) {{
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {{
                return parsed.map(p => ({{
                    ...p,
                    isOutOfStock: typeof p.isOutOfStock === 'boolean' ? p.isOutOfStock : false
                }}));
            }}
        }}
    }} catch (e) {{
        console.error('Error loading products from localStorage:', e);
    }}

    try {{
        localStorage.setItem('almathkora_products', JSON.stringify(initialDefaultProducts));
        localStorage.setItem('almathkora_products_version', PRODUCTS_DATA_VERSION);
    }} catch (e) {{}}
    return [...initialDefaultProducts];
}}

let products = loadStoredProducts();
"""
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        f.write(file_content)


class StoreHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # السماح بـ CORS لتسهيل الاتصال
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            response = {
                "status": "connected",
                "message": "خادم الحفظ المباشر يعمل بنجاح! التغييرات تُحفظ فوراً في الملفات",
                "dir": BASE_DIR
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            return
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/save-product':
            # قراءة بيانات المنتج الجديد وحفظ صورته وملف products.js
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data)
                product = data.get('product', {})
                all_products = data.get('allProducts', [])
                image_base64 = data.get('imageBase64', '')
                
                # إذا كانت هناك صورة جديدة بصيغة base64
                if image_base64 and 'base64,' in image_base64:
                    header, encoded = image_base64.split('base64,', 1)
                    # استخراج صيغة الصورة (jpg, png, webp, etc.)
                    ext = 'jpg'
                    if 'png' in header:
                        ext = 'png'
                    elif 'webp' in header:
                        ext = 'webp'
                    elif 'jpeg' in header or 'jpg' in header:
                        ext = 'jpg'
                        
                    # إنشاء اسم ملف صورة فريد ونظيف
                    image_filename = f"prod_{int(time.time())}_{product.get('id', 'item')}.{ext}"
                    image_filepath = os.path.join(IMAGES_DIR, image_filename)
                    
                    # فك تشفير الصورة وحفظها في مجلد images/
                    with open(image_filepath, "wb") as img_file:
                        img_file.write(base64.b64decode(encoded))
                        
                    # تعيين مسار الصورة كمسار محلي حقيقي
                    relative_image_path = f"images/{image_filename}"
                    product['image'] = relative_image_path
                    
                    # تحديث مسار الصورة في قائمة كل المنتجات
                    for p in all_products:
                        if p.get('id') == product.get('id'):
                            p['image'] = relative_image_path
                            break
                            
                # تحديث ملف products.js على القرص
                update_products_file_on_disk(all_products)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                res = {
                    "success": True,
                    "message": "تم حفظ المنتج والصورة في مجلد images/ وتحديث ملف products.js بنجاح!",
                    "product": product
                }
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        elif self.path == '/api/sync-products':
            # تحديث ملف products.js مباشرة عند التعديل أو الحذف
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data)
                all_products = data.get('allProducts', [])
                
                # فحص أي صور جديدة وتخزينها في images/
                for p in all_products:
                    img_data = p.get('image', '')
                    if img_data and img_data.startswith('data:image'):
                        header, encoded = img_data.split('base64,', 1)
                        ext = 'jpg'
                        if 'png' in header: ext = 'png'
                        elif 'webp' in header: ext = 'webp'
                        
                        image_filename = f"prod_{int(time.time())}_{p.get('id', 'item')}.{ext}"
                        image_filepath = os.path.join(IMAGES_DIR, image_filename)
                        with open(image_filepath, "wb") as img_file:
                            img_file.write(base64.b64decode(encoded))
                        p['image'] = f"images/{image_filename}"

                update_products_file_on_disk(all_products)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                res = {
                    "success": True,
                    "message": "تم تحديث ملف products.js على جهازك بنجاح!",
                    "allProducts": all_products
                }
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        super().do_POST()


def open_browser():
    time.sleep(1)
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    print("=" * 60)
    print("🌴 خادم متجر المذخورة للحفظ المباشر في الملفات 🌴")
    print("=" * 60)
    print(f"المجلد الحالي: {BASE_DIR}")
    print(f"مجلد الصور:    {IMAGES_DIR}")
    print(f"ملف المنتجات:  {PRODUCTS_FILE}")
    print("-" * 60)
    print(f"الموقع يعمل الآن على: http://localhost:{PORT}")
    print("أي منتج أو صورة تضيفها ستنحفظ مباشرة في ملفات جهازك!")
    print("=" * 60)
    print("لإيقاف الخادم اضغط: Ctrl + C")
    
    # فتح المتصفح تلقائياً
    threading.Thread(target=open_browser, daemon=True).start()
    
    with socketserver.TCPServer(("", PORT), StoreHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nتم إيقاف الخادم بنجاح.")
