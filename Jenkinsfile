pipeline {
    agent any
    tools {
        nodejs '18.12.0'
    }
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
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
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                        docker.image('portfolio_container:1.0').push('amorimmg/portfolio_container:1.0')
                    }
                }
            }
        }
    }
}