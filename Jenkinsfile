#!/usr/bin/env groovy

pipeline {
    agent any

    environment {
        TAG_NAME = sh(returnStdout: true, script: '[[ -z $(git tag -l --points-at HEAD) ]] && printf latest || printf $(git tag -l --points-at HEAD)')
        LOCAL_IMAGE_NAME = "geoimagenet_frontend:$TAG_NAME"
        LATEST_IMAGE_NAME = "docker-registry.crim.ca/geoimagenet/frontend:latest"
        TAGGED_IMAGE_NAME = "docker-registry.crim.ca/geoimagenet/frontend:$TAG_NAME"
    }

    options {
        buildDiscarder (logRotator(numToKeepStr:'10'))
    }

    stages {

        stage('Build') {
            steps {
                sh 'env | sort'
                sh 'docker build -t $LOCAL_IMAGE_NAME .'
            }
        }

        stage('Test') {
            steps {
                sh """
                docker run --rm $LOCAL_IMAGE_NAME /bin/sh -c \" \
                pip install -r requirements_dev.txt && \
                python -m pytest -v\"
                """
            }
        }

        stage('Deploy') {
            when {
                environment name: 'GIT_LOCAL_BRANCH', value: 'release'
            }
            steps {
                sh 'docker tag $LOCAL_IMAGE_NAME $TAGGED_IMAGE_NAME'
                sh 'docker push $TAGGED_IMAGE_NAME'
                sh 'docker tag $LOCAL_IMAGE_NAME $LATEST_IMAGE_NAME'
                sh 'docker push $LATEST_IMAGE_NAME'
                sh 'ssh ubuntu@geoimagenetdev.crim.ca "cd ~/compose && ./geoimagenet-compose.sh down && ./geoimagenet-compose.sh pull && ./geoimagenet-compose.sh up -d"'
                slackSend channel: '#jenkins-debug', color: 'good', message: "*GeoImageNet Frontend*:\nPushed docker image: `${env.TAGGED_IMAGE_NAME}`\nDeployed to: https://geoimagenetdev.crim.ca"
            }
        }
    }
    post {
       success {
           slackSend channel: '#jenkins-debug', color: 'good', message: "*GeoImageNet Frontend*: Build #${env.BUILD_NUMBER} *successful* on git branch `${env.GIT_LOCAL_BRANCH}` :tada: (<${env.BUILD_URL}|View>)"
       }
       failure {
           slackSend channel: '#jenkins-debug', color: 'danger', message: "*GeoImageNet Frontend*: Build #${env.BUILD_NUMBER} *failed* on git branch `${env.GIT_LOCAL_BRANCH}` :sweat_smile: (<${env.BUILD_URL}|View>)"
       }
    }
}