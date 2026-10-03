#!/usr/bin/env python3
"""Tar the site and push it to Railway. Used by the cloud content workflows."""
from __future__ import annotations
import json, os, subprocess, urllib.request
subprocess.run(["tar","czf","/tmp/site.tar.gz","--exclude=.git","--exclude=apps","."], check=True)
url = ("https://backboard.railway.com/project/7832b39f-a42f-4203-b6e9-bd38699670de"
       "/environment/b82a1ec2-33a3-4620-a142-82c9760affa2/up"
       "?serviceId=e37a4acb-67ad-4a46-b34d-6e85fe1e58b1")
req = urllib.request.Request(url, data=open("/tmp/site.tar.gz","rb").read(),
    headers={"Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
             "Content-Type": "application/gzip", "x-railway-caller": "cli",
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"})
print("deployed:", json.loads(urllib.request.urlopen(req, timeout=180).read())["deploymentId"])
