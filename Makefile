.PHONY: default generate stop

default:
	cd frontend && npm i && npm run build
	docker-compose up -d --build
	sleep 5
	make generate
	echo 'To go to the application, follow this link  http://localhost:8080'

generate:
	curl 'http://localhost:3000/generate?n=100'

stop:
	docker-compose down --remove-orphans