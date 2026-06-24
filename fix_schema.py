import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# The duplicates are at the very bottom. Let's find the last occurrence of 'model Experience {' and truncate there.
last_exp_idx = content.rfind('model Experience {')
first_exp_idx = content.find('model Experience {')

if last_exp_idx != first_exp_idx and first_exp_idx != -1:
    content = content[:last_exp_idx]
    
with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)