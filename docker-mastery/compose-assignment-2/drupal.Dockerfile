FROM drupal:8.2

# Best practice:    Clean up apt-get cache after install is completed,
#                   i.e. the rm command below. Add to all dockerfiles
#                   that build custom images.

RUN apt-get update && apt-get install -y git \
    &&  rm -rf /var/lib/apt/lists/* 

WORKDIR /var/www/html/themes

# RUN commands are executed as root. Here Apache expects the owner to be 
# www-data user, hence why the chown command here.

RUN git clone --branch 8.x-3.x --single-branch --depth 1 https://git.drupal.org/project/bootstrap.git \
    && chown -R www-data:www-data bootstrap

WORKDIR /var/www/html

# Don't need CMD here because we're pulling it from the drupal image.
