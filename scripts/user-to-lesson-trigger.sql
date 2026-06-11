CREATE OR REPLACE FUNCTION fill_user_lessons()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_to_lessons (user_id, lesson_id, completed)
  SELECT NEW.user_id, l.id, false
  FROM lessons l
  INNER JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = NEW.course_id
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_course_enrollment
AFTER INSERT ON users_to_courses
FOR EACH ROW EXECUTE FUNCTION fill_user_lessons();