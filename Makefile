build:
	./node_modules/.bin/snowpack build

dev:
	uvicorn backend.main:app --reload

test:
	pytest backend/tests/

