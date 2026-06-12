-- SQL-based seed script
-- Inserts the same data as the TypeScript seed.ts

-- Categories
INSERT INTO categories (id, name) VALUES
(1, 'Security'),
(2, 'Cloud');

-- Users
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Alice Johnson', 'alice@example.com', '$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.', 'learner'),
(2, 'Bob Smith', 'bob@example.com', 'hashed_password_2', 'learner'),
(3, 'Carol White', 'carol@example.com', 'hashed_password_3', 'learner'),
(4, 'Staff Admin', 'staff@example.com', '$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.', 'staff');

-- Courses
INSERT INTO courses (id, title, description, instructor, thumbnail, category_id, length) VALUES
(1, 'Ethical Hacking Fundamentals', 'Learn the core concepts of ethical hacking and penetration testing.', 'John Doe', 'https://picsum.photos/seed/ethical-hacking/600/400', 1, 36000),
(2, 'Network Defense & Hardening', 'Master firewall configuration and network hardening techniques.', 'Jane Smith', 'https://picsum.photos/seed/network-defense/600/400', 1, 30600),
(3, 'Cloud Security Architecture', 'Secure cloud infrastructure across AWS and Azure environments.', 'Carlos Rivera', 'https://picsum.photos/seed/cloud-security/600/400', 2, 43200);

-- Modules
INSERT INTO modules (id, title, course_id) VALUES
(1, 'Introduction to Penetration Testing', 1),
(2, 'Network Scanning & Enumeration', 1),
(3, 'Firewall Configuration Basics', 2),
(4, 'Intrusion Detection Systems', 2),
(5, 'AWS Security Fundamentals', 3),
(6, 'Azure Identity & Access Management', 3);

-- Lessons
INSERT INTO lessons (id, title, length, content_md, module_id) VALUES
(1, 'What is Ethical Hacking?', 750, '# What is Ethical Hacking?\n\nEthical hacking is the authorized practice of testing systems, networks, and applications to discover weaknesses before attackers do.\n\n## What you should understand\n\n- Why authorization matters\n- The difference between ethical hackers and malicious attackers\n- The role of reporting and remediation\n\n## Core idea\n\nA security assessment only creates value when the findings are documented clearly and handed back to the team that owns the system.', 1),
(2, 'Setting Up Your Lab Environment', 1080, '# Setting Up Your Lab Environment\n\nA safe lab lets you practice without risking production systems.\n\n## Recommended setup\n\n- A virtualization tool\n- An attacker machine\n- A target machine\n- A note-taking workflow for commands and findings\n\n## Before you begin\n\nMake sure snapshots are enabled so you can reset your environment after each exercise.', 1),
(3, 'Legal & Ethical Considerations', 615, '# Legal and Ethical Considerations\n\nAlways get explicit permission before testing any environment.\n\n## Rules to keep in mind\n\n- Stay within scope\n- Respect data privacy\n- Avoid destructive testing unless it is approved\n- Report findings responsibly\n\n> A good security practitioner protects trust as much as infrastructure.', 1),
(4, 'Using Nmap for Network Discovery', 1200, '# Using Nmap for Network Discovery\n\nNmap helps identify reachable hosts and exposed services.\n\n## Common workflow\n\n1. Identify live hosts\n2. Scan open ports\n3. Collect service banners\n4. Document the results\n\n## Example focus areas\n\n- TCP ports\n- UDP ports\n- Host discovery methods\n- Timing and rate considerations', 2),
(5, 'Service & Version Detection', 945, '# Service and Version Detection\n\nKnowing that a port is open is only the start. Version detection helps map a service to potential risk.\n\n## Why it matters\n\n- It helps verify what is actually running\n- It provides context for vulnerability research\n- It improves the quality of your report\n\n## Output to capture\n\n- Port number\n- Service name\n- Version string\n- Confidence or uncertainty notes', 2),
(6, 'Understanding Firewall Rules', 840, '# Understanding Firewall Rules\n\nFirewall rules define what traffic is allowed, denied, or logged.\n\n## Key concepts\n\n- Source and destination\n- Protocol and port\n- Direction of traffic\n- Default deny vs default allow\n\nA readable rule set is easier to maintain and far safer to audit.', 3),
(7, 'Configuring iptables', 1350, '# Configuring iptables\n\niptables is a rule-based packet filtering framework commonly used on Linux systems.\n\n## Typical tasks\n\n- List current rules\n- Add allow rules\n- Block unwanted traffic\n- Save and verify the final policy\n\n```bash\niptables -L -n -v\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n```', 3),
(8, 'Intro to Snort', 960, '# Intro to Snort\n\nSnort is an intrusion detection and prevention platform used to inspect traffic for suspicious patterns.\n\n## What to learn first\n\n- Traffic inspection basics\n- Rule matching flow\n- Alerting and logging\n- Tuning for noise reduction', 4),
(9, 'Writing Custom IDS Rules', 1160, '# Writing Custom IDS Rules\n\nCustom rules help detect patterns that matter to your own environment.\n\n## Good rule-writing habits\n\n- Start simple\n- Test against known traffic\n- Avoid noisy signatures\n- Add comments for future maintainers', 4),
(10, 'IAM Roles & Policies', 1020, '# IAM Roles and Policies\n\nIdentity and access management is the control plane for cloud permissions.\n\n## Design principles\n\n- Least privilege\n- Clear role boundaries\n- Short-lived credentials where possible\n- Review and removal of unused access', 5),
(11, 'S3 Bucket Security', 825, '# S3 Bucket Security\n\nStorage security depends on both bucket configuration and identity policy design.\n\n## Review checklist\n\n- Public access settings\n- Bucket policy scope\n- Encryption at rest\n- Logging and monitoring', 5),
(12, 'Azure Active Directory Basics', 900, '# Azure Active Directory Basics\n\nIdentity is central to access control in modern cloud platforms.\n\n## Focus points\n\n- Users and groups\n- Application identities\n- Role assignments\n- Directory security posture', 6),
(13, 'Conditional Access Policies', 1270, '# Conditional Access Policies\n\nConditional access applies rules to authentication decisions based on user, device, app, or location context.\n\n## Effective policy design\n\n- Start in report-only mode\n- Group similar scenarios together\n- Minimize user friction\n- Measure the impact before enforcing broadly', 6);

-- User-Course Enrollments
INSERT INTO users_to_courses (user_id, course_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 2);

-- Note: users_to_lessons is populated automatically by the trigger function
-- based on course enrollments

-- Learning Paths
INSERT INTO learning_paths (title, description, thumbnail) VALUES
('Security Foundations', 'Master the fundamentals of ethical hacking and network defense.', 'https://picsum.photos/seed/security-foundations/600/400'),
('Cloud Practitioner', 'Build a strong foundation in cloud security architecture.', 'https://picsum.photos/seed/cloud-practitioner/600/400');

-- Path-Course Associations
INSERT INTO path_courses (path_id, course_id, "position") VALUES
(1, 1, 0),
(1, 2, 1),
(2, 3, 0);

-- Seed script completed successfully!