build:
	./node_modules/.bin/snowpack build

dev:
	uvicorn backend.main:app --reload

test:
	python -m pytest


