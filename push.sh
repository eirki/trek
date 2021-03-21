#!/bin/bash
git update-index --refresh
git diff-index --quiet HEAD --
if [[ $? != 0 ]]; then
  echo
  echo "Unstaged changes, stash before deploying with:"
  echo "git stash -q --keep-index"
  echo "git stash pop -q"
  exit 1
fi

docker-machine active | grep -q 'docker-droplet'
if [[ $? != 0 ]]; then
  echo
  echo "Docker-machine not active, run:"
  echo "docker-machine env docker-droplet; and eval (docker-machine env docker-droplet)"
  exit 1
fi

make test
if [[ $? != 0 ]]; then
  exit 1
fi

DATE=$(date +%y.%m.%d)
i=0
while :
do
  tag="$DATE.$i"
  if ! git describe --tags --match "$tag" > /dev/null 2>&1; then
    break
  fi
  i=$((i+=1))
done


echo "version = \"$tag\"" > backend/version.py
git stage backend/version.py
git commit --amend --no-edit --no-verify

echo
echo "Tagging: $tag"
git tag $tag

echo
echo "Deploying"
docker-compose build
app_version=$tag docker-compose up -d

echo
echo "Pushing"
git push --no-verify && git push --no-verify --tags
