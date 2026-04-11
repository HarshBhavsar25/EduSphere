import sys
import os
import random
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from db import get_db

def add_placements(num_to_add=20):
    db = get_db()
    
    # Get unplaced students
    unplaced_students = list(db.students.find({"placed": False}))
    if not unplaced_students:
        print("No unplaced students found to place! Adding 0 placements.")
        return
        
    companies = list(db.companies.find({}))
    if not companies:
        print("No companies found!")
        return
        
    count = 0
    placements_to_add = []
    
    for student in unplaced_students[:num_to_add]:
        company = random.choice(companies)
        
        # Calculate random package between min/max
        min_pkg = company.get('min_package', 5)
        max_pkg = company.get('max_package', 15)
        pkg_range = max_pkg - min_pkg
        pkg = round(min_pkg + pkg_range * random.uniform(0.1, 1.0), 2)
        
        roles = ['Software Engineer', 'Data Analyst', 'Frontend Developer', 'Backend Developer', 'System Administrator']
        
        placement = {
            'student_id': student['_id'],
            'company_id': company['_id'],
            'role': random.choice(roles),
            'package': pkg,
            'placement_date': datetime.utcnow(),
            'status': 'confirmed'
        }
        placements_to_add.append(placement)
        db.students.update_one({'_id': student['_id']}, {'$set': {'placed': True}})
        count += 1
        
    if placements_to_add:
        db.placements.insert_many(placements_to_add)
        
    print(f"Successfully added {count} new placements!")

if __name__ == '__main__':
    add_placements(50)  # Let's add 50 new placements
