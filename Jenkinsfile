pipeline {
    agent any
    tools {
        nodejs '18.12.0'
    }
    agent {
        docker {
            image 'node:18.12.0'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('checkout') {
            steps {
                checkout scm
            }
        }

        stage('install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('WhoamI') {
            steps {
                sh 'whoami'
                sh 'ls'
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Build Image') {
            steps {
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
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                        docker.image('portfolio_container:1.0').push('amorimmg/portfolio_container:1.0')
                    }
                }
            }
        }

/*         stage('Stop Previous Build') {
            steps {
                script {
                    sh 'docker ps -f name=portfolio_container:1.0 -q | xargs --no-run-if-empty docker container stop'
                    sh 'docker container ls -a -fname=portfolio_container:1.0 -q | xargs -r docker container rm'
                }
            }
        } */

        stage('Run Docker Build') {
            steps {
                script {
                    sh 'sudo docker run --restart=always --network mynetwork -d -p 5000:5173/tcp portfolio_container:1.0'
                }
            }
        }
    }
}
