pipeline {
    agent any
    tools {
        nodejs '18.12.0'
    }
    stages{
        stage("checkout"){
            steps{
                checkout scm
            }
        }

        stage("install"){
            steps{
                sh 'npm install'
            }
        }

        stage("Build"){
            steps{
                sh 'npm run build'
            }
        }

        stage("WhoamI"){
            steps{
                sh 'whoami'
                sh 'ls'
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Setup') {
            steps {
                sh 'chown root /var/run/docker.sock'
                sh 'chown root /usr/local/bin/docker'
            }
        }

        stage("Run Docker"){
            steps{
                script {
                    docker.image('httpd:2.4-alpine').run('-d -p 80:80')
                    reuseNode true
                }
            }
        }

        stage("Build Image"){
            steps{
                script {
                    docker.build('portfolio_container:1.0', '-f Dockerfile .')
                }
            }
        }

        stage('Push Docker Image') {
            environment {
                DOCKERHUB_CREDENTIALS = credentials('docker_cred')
            }
            steps {
                script {
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        docker.image('portfolio_container:1.0').push('amorimmg/portfolio_container:1.0')
                    }
                }
            }
        }
    }
}