pipeline {
    agent any
    tools {
        nodejs '18.12.0'
    }

    environment {
        REGISTRY = 'amorimmg/portfolio_container'
        DOCKERHUB_CREDENTIALS = credentials('8bf62d16-8d89-4f75-a133-526a892fab9d')
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
                    docker.build(REGISTRY, '-f Dockerfile .')
                }
            }
        }

        stage('Docker Push Image') {
            steps {
                script {
                        def dockerCreds = credentials(DOCKERHUB_CREDENTIALS)
                        def username = dockerCreds.username
                        def password = dockerCreds.password

                        sh "docker login -u $username -p $password"
                        docker.image(REGISTRY).push('1.0')
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
                    sh 'docker run --restart=always --network portfolio -d -p 5173:5173/tcp portfolio_container:1.0'
                }
            }
        }
    }
}
