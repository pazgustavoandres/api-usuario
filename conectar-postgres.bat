@echo off
echo Conectando a PostgreSQL en Render...
set PGSSLMODE=require
psql "host=dpg-cvq6m0be5dus73f2vge0-a.oregon-postgres.render.com dbname=api_user_2qfc user=api_user_2qfc_user password=7WdQGXthhOqyYoHiaPQPKbnqL25LCYho"
pause 